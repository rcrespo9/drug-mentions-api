import cheerio from "cheerio";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "isomorphic-fetch";

import drugsData from "./data/drugs.json";

import highlightLyrics from "./highlightLyrics";
import scanLyricsForDrugs from "./scanLyricsForDrugs";

import IDrugReferences from "./types_interfaces/DrugReferences";
import ISong from "./types_interfaces/Song";

dotenv.config();

const app = express();
const port = 5000;

const corsWhitelist: string[] = [
  "http://localhost:3000",
  "https://drug-mentions.netlify.com",
  "https://drug-mentions.netlify.app"
];
const corsOptions = {
  origin(origin: any, callback: any) {
    if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

const geniusApiUrl = "https://api.genius.com";
const fetchHeaders = {
  headers: {
    Authorization: `Bearer ${process.env.GENIUS_API_TOKEN}`
  }
};

app.get("/", (req, res) => res.send("Welcome to the Drug Mentions API!"));

app.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const response = await fetch(`${geniusApiUrl}/search?q=${q}`, fetchHeaders);
    const searchResults = await response.json();
    const songsOnly = searchResults.response.hits.filter(
      (hit: any) => hit.type === "song"
    );

    res.json(songsOnly);
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
});

app.get("/song-lyrics/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const songRes = await fetch(`${geniusApiUrl}/songs/${id}`, fetchHeaders);
    const songJson = await songRes.json();
    const {
      response: { song }
    } = songJson;

    const songPage = await fetch(`${song.url}`);
    const songPageHTML = await songPage.text();

    const $ = cheerio.load(songPageHTML);
    const parsedLyrics = $("[class^='Lyrics__Container']").text();

    const drugReferencesArr = scanLyricsForDrugs(drugsData.drugs, parsedLyrics);
    const drugNames: string[] = drugReferencesArr.map(
      (drugReference) => drugReference.drugName
    );
    const totalDrugReferences: number = drugReferencesArr.reduce(
      (acc, reference) => acc + reference.referenceCount,
      0
    );
    const drugReferences: IDrugReferences = {
      references: drugReferencesArr,
      totalReferences: totalDrugReferences
    };
    const lyrics = highlightLyrics(drugNames, parsedLyrics);
    const songResponse: ISong = {
      drugReferences,
      lyrics,
      title: song.full_title
    };

    res.json(songResponse);
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
});

app.listen(process.env.PORT || port, () => {
  // tslint:disable-next-line:no-console
  console.log(`App listening on port ${process.env.PORT || port}`);
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
dotenv_1.default.config();
const app = express_1.default();
const port = 5000;
// const corsWhitelist = [];
// const corsOptions = {
//   origin(origin, callback) {
//     if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
app.use(cors_1.default());
const geniusApiUrl = "https://api.genius.com";
const fetchHeaders = {
    headers: {
        Authorization: `Bearer ${process.env.GENIUS_API_TOKEN}`,
    },
};
app.get("/", (req, res) => res.send("Welcome to the Drug Mentions API!"));
app.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    try {
        const response = yield isomorphic_fetch_1.default(`${geniusApiUrl}/search?q=${q}`, fetchHeaders);
        const searchResults = yield response.json();
        const songsOnly = searchResults.response.hits.filter((hit) => hit.type === "song");
        res.json(songsOnly);
    }
    catch (error) {
        throw new Error(error);
    }
}));
app.get("/song-lyrics/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const songRes = yield isomorphic_fetch_1.default(`${geniusApiUrl}/songs/${id}`, fetchHeaders);
        const songJson = yield songRes.json();
        const { response: { song }, } = songJson;
        const songPage = yield isomorphic_fetch_1.default(`${song.url}`);
        const songPageHTML = yield songPage.text();
        const $ = cheerio_1.default.load(songPageHTML);
        const lyrics = $(".lyrics").text();
        res.json({ title: song.full_title, lyrics });
    }
    catch (error) {
        throw new Error(error);
    }
}));
app.listen(process.env.PORT || port, () => {
    // tslint:disable-next-line:no-console
    console.log(`App listening on port ${process.env.PORT || port}`);
});
//# sourceMappingURL=index.js.map
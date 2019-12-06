import nlp from "compromise";
import drugRegex from "./drugRegex";

interface IPartOfSpeechType {
  abbr: string;
  title: string;
}

class PartOfSpeechAbbr implements IPartOfSpeechType {
  public abbr: string;
  public title: string;
  constructor(abbr: string, title: string) {
    this.abbr = abbr;
    this.title = title;
  }
}

const highlightLyrics = (drugNames: string[], lyrics: string): string => {
  let drugNamesRegexes: string[];
  let highlightRegex: RegExp;
  let highlightedLyrics: string = lyrics;

  const partOfSpeech = (word: string): IPartOfSpeechType => {
    if (nlp(word).match("#Adjective").found) {
      return new PartOfSpeechAbbr("adj.", "Adjective");
    } else if (nlp(word).match("#Pronoun").found) {
      return new PartOfSpeechAbbr("pron.", "Pronoun");
    } else if (nlp(word).match("#Verb").found) {
      return new PartOfSpeechAbbr("v.", "Verb");
    } else {
      return new PartOfSpeechAbbr("", "");
    }
  };

  drugNamesRegexes = Array.from(new Set(drugNames)).map((drug) =>
    drugRegex(drug)
  );

  highlightRegex = new RegExp(`${drugNamesRegexes.join("|")}`, "igm");

  if (drugNames.length) {
    highlightedLyrics = lyrics.replace(highlightRegex, (word) => {
      return `<mark class="highlighted">${word}${
        partOfSpeech(word).abbr && partOfSpeech(word).title
          ? ` (<abbr title="${partOfSpeech(word).title}">${
              partOfSpeech(word).abbr
            }</abbr>)`
          : ""
      }</mark>`;
    });
  }

  return highlightedLyrics.trim();
};

export default highlightLyrics;

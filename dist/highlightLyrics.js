"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compromise_1 = __importDefault(require("compromise"));
const drugRegex_1 = __importDefault(require("./drugRegex"));
class PartOfSpeechAbbr {
    constructor(abbr, title) {
        this.abbr = abbr;
        this.title = title;
    }
}
const highlightLyrics = (drugNames, lyrics) => {
    let drugNamesRegexes;
    let highlightRegex;
    let highlightedLyrics = lyrics;
    const partOfSpeech = (word) => {
        if (compromise_1.default(word).match("#Adjective").found) {
            return new PartOfSpeechAbbr("adj.", "Adjective");
        }
        else if (compromise_1.default(word).match("#Pronoun").found) {
            return new PartOfSpeechAbbr("pron.", "Pronoun");
        }
        else if (compromise_1.default(word).match("#Verb").found) {
            return new PartOfSpeechAbbr("v.", "Verb");
        }
        else {
            return new PartOfSpeechAbbr("", "");
        }
    };
    drugNamesRegexes = Array.from(new Set(drugNames)).map((drug) => drugRegex_1.default(drug));
    highlightRegex = new RegExp(`${drugNamesRegexes.join("|")}`, "igm");
    if (drugNames.length) {
        highlightedLyrics = lyrics.replace(highlightRegex, (word) => {
            return `<mark class="highlighted">${word}${partOfSpeech(word).abbr && partOfSpeech(word).title
                ? ` (<abbr title="${partOfSpeech(word).title}">${partOfSpeech(word).abbr}</abbr>)`
                : ""}</mark>`;
        });
    }
    return highlightedLyrics.trim();
};
exports.default = highlightLyrics;
//# sourceMappingURL=highlightLyrics.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compromise_1 = __importDefault(require("compromise"));
const drugRegex_1 = __importDefault(require("./drugRegex"));
const drugRefMatches = (drugName, lyrics) => {
    const regex = new RegExp((0, drugRegex_1.default)(drugName), "igm");
    const matches = lyrics.match(regex);
    return matches;
};
const scanLyricsForDrugs = (drugs, lyrics) => {
    const drugReferences = [];
    // tslint:disable-next-line:max-line-length
    const replacedStr = "\n[replaced]\n"; // small hack until compromise library fixes bug that removes whitespace when words are deleted/replaced
    const lyricsHeadersRegex = /(?:(\[|\()(Intro|Verse|Chorus|Bridge)).*(?:\]|\))/gim;
    const sanitizedLyrics = (0, compromise_1.default)(lyrics.replace(/<br\s*[\/]?>/gi, " ").replace(lyricsHeadersRegex, " "))
        .replace("#Contraction", replacedStr)
        .out("text");
    const drugInRefArray = (drugName) => drugReferences.find((drugMentioned) => drugMentioned.drugName === drugName);
    drugs.forEach((drug) => {
        const drugTypesMentioned = drugRefMatches(drug.drugType, sanitizedLyrics);
        if (drugTypesMentioned) {
            drugReferences.push({
                drugName: drug.drugType,
                isStreetName: false,
                referenceCount: drugTypesMentioned.length
            });
        }
        if (drug.streetNames.length) {
            drug.streetNames.forEach((streetName) => {
                const streetNamesMentioned = drugRefMatches(streetName, sanitizedLyrics);
                if (streetNamesMentioned) {
                    if (drugInRefArray(streetName)) {
                        const { drugTypes } = drugInRefArray(streetName);
                        if (!drugTypes.includes(drug.drugType)) {
                            drugTypes.push(drug.drugType);
                        }
                    }
                    else {
                        drugReferences.push({
                            drugName: streetName,
                            drugTypes: [drug.drugType],
                            isStreetName: true,
                            referenceCount: streetNamesMentioned.length
                        });
                    }
                }
            });
        }
    });
    return drugReferences;
};
exports.default = scanLyricsForDrugs;
//# sourceMappingURL=scanLyricsForDrugs.js.map
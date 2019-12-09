import nlp from "compromise";
import drugRegex from "./drugRegex";
import IDrugReference from "./types_interfaces/DrugReference";

const drugRefMatches = (
  drugName: string,
  lyrics: string
): RegExpMatchArray | null => {
  const regex: RegExp = new RegExp(drugRegex(drugName), "igm");
  const matches = lyrics.match(regex);

  return matches;
};

const scanLyricsForDrugs = (drugs: any[], lyrics: string): IDrugReference[] => {
  const drugReferences: IDrugReference[] = [];
  // tslint:disable-next-line:max-line-length
  const replacedStr = "\n[replaced]\n"; // small hack until compromise library fixes bug that removes whitespace when words are deleted/replaced
  const lyricsHeadersRegex = /(?:(\[|\()(Intro|Verse|Chorus|Bridge)).*(?:\]|\))/gim;
  const sanitizedLyrics = nlp(lyrics.replace(lyricsHeadersRegex, " "))
    .replace("#Contraction", replacedStr)
    .out("text");
  const drugInRefArray = (drugName: string): IDrugReference | undefined =>
    drugReferences.find(
      (drugMentioned: IDrugReference) => drugMentioned.drugName === drugName
    );

  drugs.forEach((drug) => {
    const drugTypesMentioned = drugRefMatches(
      drug.drugType,
      sanitizedLyrics as string
    );

    if (drugTypesMentioned) {
      drugReferences.push({
        drugName: drug.drugType,
        isStreetName: false,
        referenceCount: drugTypesMentioned.length
      });
    }

    if (drug.streetNames.length) {
      drug.streetNames.forEach((streetName: string) => {
        const streetNamesMentioned = drugRefMatches(
          streetName,
          sanitizedLyrics as string
        );
        if (streetNamesMentioned) {
          // tslint:disable-next-line:no-console
          console.log(streetNamesMentioned);
          if (drugInRefArray(streetName)) {
            const { drugTypes } = drugInRefArray(streetName)!;
            if (!drugTypes!.includes(drug.drugType)) {
              drugTypes!.push(drug.drugType);
            }
          } else {
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

export default scanLyricsForDrugs;

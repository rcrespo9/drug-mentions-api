import { escapeRegExp } from "lodash";

const drugRegex = (drugName: string): string => {
  const commonCharacters = ".,/#!$%^&*;:{}=\\-_`~@é";
  const lookBehindCharacterSet = `[${commonCharacters}]`;
  const lookAheadCharacterSet = `[${commonCharacters}'‘’“”"]`;

  return `(?<!${lookBehindCharacterSet})\\b${escapeRegExp(
    drugName
  )}s?(?!${lookAheadCharacterSet}\\b)\\b(?![.*])`;
};

export default drugRegex;

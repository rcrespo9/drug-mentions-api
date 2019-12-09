import { escapeRegExp } from "lodash";
import pluralize from "pluralize";

const drugRegex = (drugName: string): string => {
  const commonCharacters = ".,/#!$%^&*;:{}=\\-_`~@é";
  const lookBehindCharacterSet = `[${commonCharacters}]`;
  const lookAheadCharacterSet = `[${commonCharacters}'‘’“”"]`;
  const excludedPluralize = ["She", "He", "E"];
  const pluralDrugName = excludedPluralize.includes(drugName)
    ? drugName
    : pluralize(drugName);
  const regex = `(?<!${lookBehindCharacterSet})\\b${escapeRegExp(
    pluralDrugName
  )}(?!${lookAheadCharacterSet}\\b)\\b(?![.*é])|(?<!${lookBehindCharacterSet})\\b${escapeRegExp(
    pluralize.singular(drugName)
  )}(?!${lookAheadCharacterSet}\\b)\\b(?![.*é])`;

  return regex;
};

export default drugRegex;

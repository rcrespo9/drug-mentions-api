import { escapeRegExp } from "lodash";
import pluralize from "pluralize";

const drugRegex = (drugName: string): string => {
  const commonCharacters = ".,/#!$%^&*;:{}=\\-_`~@é";
  const lookBehindCharacterSet = `[${commonCharacters}]`;
  const lookAheadCharacterSet = `[${commonCharacters}'‘’“”"]`;

  return `(?<!${lookBehindCharacterSet})\\b${escapeRegExp(
    pluralize.plural(drugName)
  )}(?!${lookAheadCharacterSet}\\b)\\b(?![.*é])|(?<!${lookBehindCharacterSet})\\b${escapeRegExp(
    pluralize.singular(drugName)
  )}(?!${lookAheadCharacterSet}\\b)\\b(?![.*é])`;
};

export default drugRegex;

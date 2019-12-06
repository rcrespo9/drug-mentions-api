"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const drugRegex = (drugName) => {
    const commonCharacters = ".,/#!$%^&*;:{}=\\-_`~@é";
    const lookBehindCharacterSet = `[${commonCharacters}]`;
    const lookAheadCharacterSet = `[${commonCharacters}'‘’“”"]`;
    return `(?<!${lookBehindCharacterSet})\\b${lodash_1.escapeRegExp(drugName)}s?(?!${lookAheadCharacterSet}\\b)\\b(?![.*])`;
};
exports.default = drugRegex;
//# sourceMappingURL=drugRegex.js.map
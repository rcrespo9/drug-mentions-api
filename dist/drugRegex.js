"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const pluralize_1 = __importDefault(require("pluralize"));
const drugRegex = (drugName) => {
    const commonCharacters = ".,/#!$%^&*;:{}=\\-_`~@é";
    const lookBehindCharacterSet = `[${commonCharacters}]`;
    const lookAheadCharacterSet = `[${commonCharacters}'‘’“”"]`;
    return `(?<!${lookBehindCharacterSet})\\b${lodash_1.escapeRegExp(pluralize_1.default.plural(drugName))}(?!${lookAheadCharacterSet}\\b)\\b(?![.*é])|(?<!${lookBehindCharacterSet})\\b${lodash_1.escapeRegExp(pluralize_1.default.singular(drugName))}(?!${lookAheadCharacterSet}\\b)\\b(?![.*é])`;
};
exports.default = drugRegex;
//# sourceMappingURL=drugRegex.js.map
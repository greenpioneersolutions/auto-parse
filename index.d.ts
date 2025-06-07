export interface AutoParseOptions {
  preserveLeadingZeros?: boolean;
  allowedTypes?: string[];
  stripStartChars?: string | string[];
  parseCommaNumbers?: boolean;
  currencySymbols?: Record<string, string>;
  currencyAsObject?: boolean;
  percentAsObject?: boolean;
  rangeAsObject?: boolean;
  expandEnv?: boolean;
  parseFunctionStrings?: boolean;
  parseCurrency?: boolean;
  parsePercent?: boolean;
  parseUnits?: boolean;
  parseRanges?: boolean;
  booleanSynonyms?: boolean;
  parseMapSets?: boolean;
  parseTypedArrays?: boolean;
  parseExpressions?: boolean;
  parseDates?: boolean;
  parseUrls?: boolean;
  parseFilePaths?: boolean;
  onError?: (err: any, value: any, type?: any) => any;
  type?: any;
}
export type Parser = (value: any, type?: any, options?: AutoParseOptions) => any | undefined;
export default function autoParse(value: any, typeOrOptions?: any | AutoParseOptions): any;
export declare namespace autoParse {
  function use(fn: Parser): void;
  function setErrorHandler(fn: ((err: any, value: any, type?: any) => any) | null): void;
}

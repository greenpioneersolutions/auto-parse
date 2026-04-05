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
  dateFormat?: 'us' | 'eu' | 'iso';
  schema?: Record<string, string | (new (...args: any[]) => any)>;
  onError?: (err: any, value: any, type?: any) => any;
  type?: any;
}

export type Parser = (value: any, type?: any, options?: AutoParseOptions) => any | undefined;

export default function autoParse(value: string, type: typeof Number | 'number'): number;
export default function autoParse(value: string, type: typeof String | 'string'): string;
export default function autoParse(value: string, type: typeof Boolean | 'boolean'): boolean;
export default function autoParse(value: string, type: typeof Date | 'date'): Date;
export default function autoParse(value: string, type: 'bigint'): bigint;
export default function autoParse(value: string, type: 'symbol'): symbol;
export default function autoParse(value: string, type: 'null'): null;
export default function autoParse(value: string, type: 'undefined'): undefined;
export default function autoParse(value: any, type?: any | AutoParseOptions, options?: AutoParseOptions): any;

export declare namespace autoParse {
  function use(fn: Parser): void;
  function setErrorHandler(fn: ((err: any, value: any, type?: any) => any) | null): void;
}

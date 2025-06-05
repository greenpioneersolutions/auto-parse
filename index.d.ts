export interface AutoParseOptions {
  preserveLeadingZeros?: boolean;
  allowedTypes?: string[];
  stripStartChars?: string | string[];
  parseCommaNumbers?: boolean;
}
export type Parser = (value: any, type?: any, options?: AutoParseOptions) => any | undefined;
export default function autoParse(value: any, type?: any, options?: AutoParseOptions): any;
export declare namespace autoParse {
  function use(fn: Parser): void;
}

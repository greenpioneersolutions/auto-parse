export type Parser = (value: any, type?: any) => any | undefined;
export default function autoParse(value: any, type?: any): any;
export declare namespace autoParse {
  function use(fn: Parser): void;
}

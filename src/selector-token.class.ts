import { SelectorTokenTypes } from "./selector-token-types.enum";

export class SelectorToken {
  constructor(
    public sign: boolean,
    public type: SelectorTokenTypes,
    public value: string
  ) { }
}
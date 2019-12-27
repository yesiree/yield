import { SelectorToken } from "./selector-token.class";
import { SelectorTokenTypes } from "./selector-token-types.enum";

export class SelectorSegment {
  constructor(
    public tokens: SelectorToken[]
  ) { }

  toString() {
    return this.tokens.map(x => {
      const sign = x.sign ? '' : '!'
      switch (x.type) {
        case SelectorTokenTypes.Element: return `${sign}<${x.value}>`
        case SelectorTokenTypes.Attribute: return `${sign}[${x.value}]`
      }
    }).join('')
  }
}
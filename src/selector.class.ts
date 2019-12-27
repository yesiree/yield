import { SelectorTokenTypes } from "./selector-token-types.enum"
import { SelectorSegment } from "./selector-segment.class"
import { SelectorToken } from "./selector-token.class"

export class Selector {
  static _SEPARATORS = ['[', ']', '!']

  segments: SelectorSegment[] = []

  constructor(str: string) {
    this.segments = str
      .split(/\s/g)
      .map(segment => {
        const tokens: SelectorToken[] = []
        let sign = true
        let type = SelectorTokenTypes.Element
        let value = ''
        for (let i = 0; i < segment.length; i++) {
          let ch = segment.charAt(i)
          if (
            !Selector._SEPARATORS.includes(ch) ||
            (ch !== ']' && type === SelectorTokenTypes.Attribute)
          ) {
            value += ch
          } else {
            if (value) {
              tokens.push(new SelectorToken(sign, type, value))
              value = ''
              sign = true
            }
            switch (ch) {
              case '!': sign = false
                break
              case '[': type = SelectorTokenTypes.Attribute
                break
              default: type = SelectorTokenTypes.Element
            }
          }
        }
        if (value) {
          tokens.push(new SelectorToken(sign, type, value))
        }
        return new SelectorSegment(tokens)
      })
  }

  [Symbol.iterator]() {
    let index = 0
    const self = this
    return {
      next() {
        return index < self.segments.length
          ? { done: false, value: self.segments[index++] }
          : { done: true }
      }
    }
  }

  toString() {
    return this.segments.map(x => x.toString()).join(' ')
  }
}

import { BaseNode } from "./base-node.class"
import { NodeTypes } from "./node-types.enum"
import chalk from 'chalk'
import { SelectorSegment } from "./selector-segment.class"
import { SelectorTokenTypes } from "./selector-token-types.enum"

export class DirectiveNode extends BaseNode {

  constructor(
    public name: string,
    public data: string,
    parent: BaseNode | null = null
  ) {
    super(NodeTypes.Directive, parent, [])
    this.name = name
    this.data = data
  }

  clone(parent: BaseNode | null = null): DirectiveNode {
    return new DirectiveNode(
      this.name.slice(),
      this.data.slice(),
      parent
    )
  }

  toString() {
    return chalk.yellow(`<${this.data}>`)
  }

  serialize(): string {
    return `<${this.data}>`
  }

  protected _matchesSegment(segment: SelectorSegment) {
    return segment.tokens.every(token => {
      return !token.sign
      // let match = false
      // switch (token.type) {
      //   case SelectorTokenTypes.Element:
      //     match = token.value === this.tag
      //     break
      //   case SelectorTokenTypes.Attribute:
      //     match = token.value in (this.attrs || {})
      //     break
      // }
      // return token.sign ? match : !match
    })
  }

}

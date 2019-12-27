import { BaseNode } from "./base-node.class"
import { NodeTypes } from "./node-types.enum"
import chalk from 'chalk'

export class TextNode extends BaseNode {
  constructor(
    public text: string = '',
    parent: BaseNode | null = null,
  ) {
    super(NodeTypes.Text, parent, [])
  }

  clone(parent: BaseNode | null = null): TextNode {
    return new TextNode(this.text.slice(), parent)
  }

  toString() {
    return chalk.gray(`[TEXT NODE]`)
  }

  serialize(minify: boolean = false): string {
    return minify
      ? this.text.replace(/\s+/g, ' ')
      : this.text
  }
}
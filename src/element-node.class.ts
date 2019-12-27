import { BaseNode } from "./base-node.class"
import { NodeTypes } from "./node-types.enum"
import { SelectorSegment } from "./selector-segment.class"
import { SelectorTokenTypes } from "./selector-token-types.enum"
import chalk = require("chalk")

type Attrs = { [key: string]: string }

export class ElementNode extends BaseNode {
  attrs: Attrs
  id: string | undefined = undefined
  classes: string[] = []

  constructor(
    public tag: string,
    attrs?: Attrs,
    parent: BaseNode | null = null,
    children: BaseNode[] = []
  ) {
    super(NodeTypes.Element, parent, children)
    this.tag = tag
    this.attrs = attrs || {}
    this.id = this.attrs.id
    this.classes = this.attrs.class
      ? this.attrs.class.split(/\s/g)
      : []
  }

  clone(parent: BaseNode | null = null): ElementNode {
    const attrs: Attrs = {}
    Object
      .keys(this.attrs)
      .forEach(key => attrs[key] = this.attrs[key].slice())
    const node = new ElementNode(
      this.tag.slice(),
      attrs,
      parent
    )
    node.setChildren(this.children.map(c => c.clone(node)))
    return node
  }

  removeAttr(key: string) {
    const value = this.attrs[key]
    delete this.attrs[key]
    return value
  }

  replaceWithChildren() {
    this.replaceWith(this.children)
  }

  toString() {
    return chalk.green(`<${this.tag}>`)
    // let identity = `${super.toString()} ${this.tag}`
    // if (this.id) identity += `#${this.id}`
    // if (this.classes && this.classes.length) {
    //   identity += `.${this.classes.join('.')}`
    // }
    // return identity
  }

  protected _matchesSegment(segment: SelectorSegment) {
    return segment.tokens.every(token => {
      let match = false
      switch (token.type) {
        case SelectorTokenTypes.Element:
          match = token.value === this.tag
          break
        case SelectorTokenTypes.Attribute:
          match = token.value in (this.attrs || {})
          break
      }
      return token.sign ? match : !match
    })
  }

  _serializeAttrs() {
    let attrs = Object
      .keys(this.attrs)
      .map(key => {
        const value = this.attrs[key]
        return value
          ? `${key}="${value}"`
          : key
      })
      .join(' ')
    return attrs ? ` ${attrs}` : ''
  }

  serialize(minify: boolean = false): string {
    if (this.tag === BaseNode.templateTagName) {
      return this._serializeChildren(minify)
    }
    const attrs = this._serializeAttrs()
    return `<${this.tag}${attrs}>`
      + this._serializeChildren(minify)
      + `</${this.tag}>`
  }

}

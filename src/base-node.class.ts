import { NodeTypes } from "./node-types.enum";
import { Selector } from "./selector.class";
import { SelectorSegment } from "./selector-segment.class";
import chalk = require("chalk");

export class BaseNode {
  public static templateTagName = '#template'
  private static SELECTOR_CACHE: { [key: string]: Selector } = { }

  constructor(
    public type: NodeTypes,
    public parent: BaseNode | null = null,
    public children: BaseNode[] = []
  ) { }

  clone(parent: BaseNode | null = null) : BaseNode {
    const node = new BaseNode(this.type, parent)
    node.setChildren(this.children.map(c => c.clone(node)))
    return node
  }

  setChildren(children: BaseNode[]) {
    this.children.splice(0, this.children.length, ...children)
  }

  insertAfter(nodes: BaseNode | BaseNode[]) {
    if (!Array.isArray(nodes)) nodes = [nodes]
    if (!this.parent) return
    const index = this.parent.children.indexOf(this)
    this.parent.children.splice(index, 0, ...nodes)
    nodes.forEach(n => n.parent = this.parent)
  }

  replaceWith(nodes: BaseNode | BaseNode[]) {
    if (!Array.isArray(nodes)) nodes = [nodes]
    if (!this.parent) return
    const index = this.parent.children.indexOf(this)
    this.parent.children.splice(index, 1, ...nodes)
    nodes.forEach(n => n.parent = this.parent)
  }

  remove() {
    if (!this.parent) return
    const index = this.parent.children.indexOf(this)
    this.parent.children.splice(index, 1)
    this.parent = null
  }

  toString() {
    return `[${this.type.toUpperCase()}]`
  }

  toTreeString(depth = 0) : string {
    const indent = '  '.repeat(depth)
    return `${indent}${chalk.blueBright(this.toString())}\n`
      + this.children
          .filter(x => x.type !== NodeTypes.Text)
          .map(n => n.toTreeString(depth + 1))
          .join('')
  }

  serialize(minify: boolean = false): string {
    return this._serializeChildren(minify)
  }

  protected _getWhitespace(indent: string | number, depth: number) : string {
    return typeof indent === 'string'
      ? indent
      : ' '.repeat(indent).repeat(depth)
  }

  protected _serializeChildren(minify: boolean = false): string {
    return this.children
      .map(x => x.serialize(minify))
      .join('')
  }

  get innerHTML() {
    return this._serializeChildren()
  }

  get outerHTML() {
    return this.serialize()
  }

  get minified() {
    return this.serialize(true)
  }

  queryChildren(selectorStrs: string): BaseNode[] {
    let results: BaseNode[] = []
    selectorStrs.split(/,/g).forEach(selectorStr => {
      const selector = this._memoizeSelectors(selectorStr)
      const segment = selector.segments[0]
      if (!segment || selector.segments.length > 1) return
      this.children.forEach(node => {
        if (node._matchesSegment(segment)) {
          results.push(node)
        }
      })
    })
    return results
  }

  queryAll(selectorStrs: string) : BaseNode[] {
    let results: BaseNode[] = []
    selectorStrs.split(/,/g).forEach(selectorStr => {
      const selector = this._memoizeSelectors(selectorStr)
      let found: BaseNode[] = [this]
      for (let segment of selector) {
        if (!segment) continue
        results.push(...this._matchAll(segment, found))
      }
    })
    return results
  }

  private _matchAll(
    segment: SelectorSegment,
    nodes: BaseNode[] = []
  ): BaseNode[] {
    if (!nodes.length) return []
    const found: BaseNode[] = []
    nodes.forEach(node => {
      if (node._matchesSegment(segment)) {
        found.push(node)
      }
      found.push(...this._matchAll(segment, node.children))
    })
    return found
  }

  protected _matchesSegment(segment: SelectorSegment) : boolean {
    return false
  }

  private _memoizeSelectors(selectorStr: string) {
    let selector = BaseNode.SELECTOR_CACHE[selectorStr]
    if (!selector) {
      selector = BaseNode.SELECTOR_CACHE[selectorStr] = new Selector(selectorStr)
    }
    return selector
  }
}

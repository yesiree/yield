import * as yaml from 'js-yaml'
import marked from 'marked'
import highlight from 'highlight.js'
import * as expression from 'expression-eval'
import { ElementNode } from "../element-node.class"
import { BaseNode } from "../base-node.class"
import { TextNode } from "../text-node.class"
import { NodeTypes } from '../node-types.enum'
import { NodeUtils } from '../node-utils.class'
import { File } from './file.class'

marked.setOptions({
  highlight: function(code) {
    return highlight.highlightAuto(code).value
  },
  // headerIds: true,
  // gfm: true,
  smartLists: true,
  smartypants: true
})

const forEachAttrKey = '#foreach'
const ifAttrKey = '#if'
const slotAttrKey = '#slot'

const primarySlotKey = Symbol('Symbol.primarySlotKey') as unknown as string
const captureFmRegex = /^---\s*$([\s\S]*?)^---\s*$([\s\S]*)/m
const captureInterpolation = /{{(.*?)}}/g

export class Page {
  meta: any = {}
  layout: string | undefined
  dom: BaseNode

  constructor(file: File) {
    const [
      , head, body = file.content
    ] = captureFmRegex.exec(file.content) || []
    this.meta = Object.assign(
      { markdown: true },
      head && yaml.load(head) || {}
    )
    this.layout = this.meta.layout
    delete this.meta.layout
    delete this.meta.slot
    this.dom = NodeUtils.parse(
      this.meta.markdown ? marked(body) : body
    )
  }

  private _eval(expr: string, context: any) : any {
    try {
      return expression.compile(expr)(context)
    } catch (e) {
      const message = e && typeof e === 'object'
        ? e.message
        : '' + e
      throw Error(`Error in interpolation expression: "${expr}"\n  ${message}`)
    }
    // TODO: pipe chain stuff
  }

  private _interpretNode(
    node: BaseNode,
    context: any,
    inserts: { [key: string]: ElementNode }
  ) {

  }

  private async _interpret(
    context: any,
    layouts: { [key: string]: Page },
    inserts?: { [key: string]: ElementNode } | undefined
  ): Promise<{ [key: string]: ElementNode }> {
    const isLayout = !!inserts
    if (isLayout) {
      context = Object.assign({}, this.meta, context)
    } else {
      context = Object.assign({}, context, this.meta)
    }
    const outsert: { [key: string]: ElementNode } = {}
    const clone = NodeUtils.clone(this.dom)
    this._interpretNode(clone, context, inserts || {})
    clone.queryChildren('[#insert]').forEach(node => {
      if (!(node instanceof ElementNode)) return
      const slotKey = node.attrs['#insert']
      outsert[slotKey] = node
    })
    const primaryNodes = clone.queryChildren('![#insert]')
    outsert[primarySlotKey] = new ElementNode(
      BaseNode.templateTagName, {}, null, primaryNodes
    )
    if (this.layout) {
      // todo
    }
    const layout = this.layout && layouts[this.layout] || null
    if (layout) {
      return layout._interpret(context, layouts, outsert)
    }
    return outsert

    // TODO expression | pipe-chain : args
  }

  render(
    context: any,
    layouts: { [key: string]: Page }
  ): Promise<string> {
    return this
      ._interpret(context, layouts)
      .then(inserts => {
        return inserts[primarySlotKey].minified
      })
  }
}

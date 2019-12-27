import * as expression from 'expression-eval'
import * as yaml from 'js-yaml'
import marked from 'marked'
import highlight from 'highlight.js'
import { DefaultPipes } from "./pipes.const"
import { ElementNode } from "./element-node.class"
import { NodeUtils } from "./node-utils.class"
import { BaseNode } from './base-node.class'
import { TextNode } from './text-node.class'
import { NodeTypes } from './node-types.enum'
import chalk from 'chalk'
import { Timer } from './timer.class'

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

/*

gen.watch(glob, [callback/promise])
gen.watch$(glob)
gen.read(glob, [callback/promise])

*/

type Page = { path: string, content: string }
type PageResolver = (path: string) => Promise<Page> | Page
type DataResolver = (path: string) => Promise<Object> | Object
type DataMap = { [key: string]: Object }
type PipeMap = { [key: string]: (value: any, ...args: any) => any }
type ElementNodeMap = { [key: string]: ElementNode }

export class Generator {
  private checkTime = false
  private timer = new Timer()

  private getPage: PageResolver
  private getData: DataResolver
  private pipes: PipeMap

  constructor(config: {
    getPage: PageResolver,
    getData: DataResolver,
    pipes?: PipeMap
  }) {
    this.getPage = config.getPage
    this.getData = config.getData
    this.pipes = Object.assign(DefaultPipes, config.pipes)
  }

  async render(path: string): Promise<string> {
    const time = this.checkTime && true
    time && this.timer.start('render')
    try {
      const outserts = await this._interpret(path)
      time && this.timer.log('render')
      return outserts[primarySlotKey].minified
    } catch (e) {
      // TODO: log out nice little error messages
      throw e
    }
  }

  private async _interpret(
    path: string,
    context?: Object,
    inserts?: ElementNodeMap | undefined
  ): Promise<ElementNodeMap> {
    const time = this.checkTime && true
    time && this.timer.start('_interpret')

    const page = await this.getPage(path)
    const {
      dom,
      meta,
      layout
    } = await this._parse(page)

    const isLayout = !!inserts
    context = isLayout
      ? Object.assign({}, meta, context)
      : Object.assign({}, context, meta)

    const clone = NodeUtils.clone(dom)
    this._interpretNode(clone, context, inserts || {})
    const outserts: ElementNodeMap = clone
      .queryChildren('[#insert]')
      .reduce((outserts: ElementNodeMap, node) => {
        if (node instanceof ElementNode) {
          const slotKey = node.attrs['#insert']
          outserts[slotKey] = node
        }
        return outserts
      }, {})
    const primaryNodes = clone.queryChildren('![#insert]')
    outserts[primarySlotKey] = new ElementNode(
      BaseNode.templateTagName, {}, null, primaryNodes
    )
    if (layout) {
      time && this.timer.log('_interpret')
      return this._interpret(layout, context, outserts)
    }
    time && this.timer.log('_interpret')
    return outserts
  }

  private _interpretNode(
    node: BaseNode,
    context: Object,
    inserts: ElementNodeMap
  ) {
    const time = this.checkTime && true
    time && this.timer.start('_interpretNode ' + node.toString())

    if (node instanceof ElementNode) {
      const {
        [forEachAttrKey]: forEachAttr,
        [ifAttrKey]: ifExpr,
        [slotAttrKey]: slotAttr
      } = node.attrs
      if (forEachAttr) {
        delete node.attrs[forEachAttrKey]
        const [itemKey, , arrExpr] = forEachAttr.split(/\s/g)
        const arr = this._eval(arrExpr, context)
        arr.map((item: any) => {
          const child = node.clone()
          node.insertAfter(child)
          const childContext = Object.assign({}, context, { [itemKey]: item })
          this._interpretNode(child, childContext, inserts)
          return child
        })
        node.remove()
        time && this.timer.log('_interpretNode ' + node.toString())
        return
      }
      if (ifExpr) {
        delete node.attrs[ifAttrKey]
        if (!this._eval(ifExpr, context)) {
          node.remove()
          time && this.timer.log('_interpretNode ' + node.toString())
          return
        }
      }
      if (typeof slotAttr === 'string') {
        const insert = inserts[slotAttr || primarySlotKey]
        if (insert) node.children = [insert]
        time && this.timer.log('_interpretNode ' + node.toString())
        return
      }
      Object.keys(node.attrs).forEach(key => {
        node.attrs[key].replace(captureInterpolation, (m, expr) => {
          return this._eval(expr, context)
        })
      })
      node.children.forEach(x => this._interpretNode(x, context, inserts))
      time && this.timer.log('_interpretNode ' + node.toString())
    } else if (node instanceof TextNode) {
      node.text = node.text.replace(captureInterpolation, (m, expr) => {
        return this._eval(expr, context)
      })
      time && this.timer.log('_interpretNode ' + node.toString())
    } else if (
      node instanceof BaseNode
      && node.type === NodeTypes.Root
    ) {
      node.children.forEach(x => {
        this._interpretNode(x, context, inserts)
      })
      time && this.timer.log('_interpretNode ' + node.toString())
    }
  }

  private async _parse(page: Page): Promise<{
    dom: BaseNode,
    meta: Object,
    layout: string
  }> {
    const time = this.checkTime && true
    time && this.timer.start(`_parse ${page.path}`)

    const [
      , head, body = page.content
    ] = captureFmRegex.exec(page.content) || []
    const meta = Object.assign({}, head && yaml.load(head) || {})
    const layout = meta.layout
    delete meta.layout
    const dom = NodeUtils.parse(
      meta.markdown ? marked(body) : body
    )
    const data = meta.data || {}
    delete meta.data
    return Promise.all(
      Object.keys(data).map(key => {
        return Promise
          .resolve(this.getData(data[key]))
          .then(value => ({ key, value }))
      })
    ).then(args => {
      meta.data = args.reduce((data: DataMap, item) => {
        data[item.key] = item.value
        return data
      }, {})
      time && this.timer.log(`_parse ${page.path}`)
      return { dom, meta, layout }
    })
  }

  private _eval(statement: string, context: any): any {
    const time = this.checkTime && true
    time && this.timer.start(`_eval: ${statement}`)

    try {
      const [expr, ...pipes] = statement.split(/\|/g)
      let value = expression.compile(expr)(context)
      value = pipes.reduce((result: any, pipe: string) => {
        const [fnKey, ...args] = pipe.split(/:/g).map(x => x.trim())
        const fn = this.pipes[fnKey]
        if (!fn) throw Error(`Pipe function '${fnKey} not found!`)
        return fn(result, ...args.map(x => expression.compile(x)(context)))
      }, value)
      time && this.timer.log(`_eval: ${statement}`)
      return value
    } catch (e) {
      const message = e && typeof e === 'object'
        ? e.message
        : '' + e
      throw Error(`\nSyntax error in expression: "${statement}"\n  ${message}`)
    }
  }
}

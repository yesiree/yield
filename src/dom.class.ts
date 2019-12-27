// import { RootNode } from "./root-node.class";
// import { ElementNode } from "./element-node.class";
// import { TextNode } from "./text-node.class";
// import { BaseNode } from "./base-node.class";
// import { Selector } from "./selector.class";
// import { SelectorSegment } from "./selector-segment.class";
// import { SelectorTokenTypes } from "./selector-token-types.enum";
// import { Parser } from 'htmlparser2'

// export class Dom {
//   static SELECTOR_CACHE: { [key: string]: Selector } = {}

//   _tree: RootNode = new RootNode()

//   constructor(html: string) {
//     this._tree = this.parse(html)
//   }

//   serialize() {
//     return this._tree.serialize()
//   }

//   queryAll(selectorStrs: string) {
//     let results: BaseNode[] = []
//     selectorStrs.split(/,/g).forEach(selectorStr => {
//       const selector = this._memoizeSelectors(selectorStr)
//       let found: BaseNode[] = [this._tree]
//       for (let segment of selector) {
//         if (!segment) continue
//         results.push(...this._matchAll(segment, found))
//       }
//     })
//     return results
//   }

//   private _matchAll(
//     segment: SelectorSegment,
//     nodes: BaseNode[] = []
//   ): BaseNode[] {
//     if (!nodes.length) return []
//     const found: BaseNode[] = []
//     nodes
//       .forEach(node => {
//         if (node instanceof ElementNode) {
//           const include = segment.tokens.every(token => {
//             switch (token.type) {
//               case SelectorTokenTypes.Element: return token.value === node.tag
//               case SelectorTokenTypes.Attribute: return token.value in (node.attrs || {})
//             }
//           })
//           if (include) found.push(node)
//         }
//         found.push(...this._matchAll(segment, node.children))
//     })
//     return found
//   }

//   private _memoizeSelectors(selectorStr: string) {
//     let selector = Dom.SELECTOR_CACHE[selectorStr]
//     if (!selector) {
//       selector = Dom.SELECTOR_CACHE[selectorStr] = new Selector(selectorStr)
//     }
//     return selector
//   }

//   parse(
//     html: string,
//     root: BaseNode = new RootNode()
//   ): BaseNode {
//     let current: BaseNode | null = root
//     const parser = new Parser({
//       onopentag(tag: string, attrs: { [key: string]: string }) {
//         const node = new ElementNode(tag, attrs, current)
//         current && current.children.push(node)
//         current = node
//       },
//       ontext(text: string) {
//         const node = new TextNode(text, current)
//         current && current.children.push(node)
//       },
//       onclosetag(tag: string) {
//         current = current && current.parent
//       }
//     }, { decodeEntities: true })
//     parser.write(html.trim())
//     parser.end()
//     return root
//   }
// }

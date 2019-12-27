import { BaseNode } from "./base-node.class"
import { Parser } from "htmlparser2"
import { ElementNode } from "./element-node.class"
import { TextNode } from "./text-node.class"
import { RootNode } from "./root-node.class"
import { DirectiveNode } from "./directive-node.class"
import { NodeTypes } from "./node-types.enum"

export class NodeUtils {
  static clone(node: BaseNode) : BaseNode {
    // FIX: TEMP SOLUTION FOR DEEP COPY
    let clone = NodeUtils.parse(node.serialize())
    if (node.type !== NodeTypes.Root) {
      clone = clone.children.pop() || {} as BaseNode
    }
    return clone
  }

  static serialize(nodes: BaseNode[]) {
    return new RootNode(null, nodes).serialize()
  }

  static parse(
    html: string,
    root: BaseNode = new RootNode()
  ): BaseNode {
    let current: BaseNode | null = root
    const parser = new Parser({
      onprocessinginstruction(name: string, data: string) {
        const node = new DirectiveNode(name, data)
        current && current.children.push(node)
      },
      onopentag(tag: string, attrs: { [key: string]: string }) {
        // console.log(`>${tag}`)
        const node = new ElementNode(tag, attrs, current)
        current && current.children.push(node)
        current = node
      },
      ontext(text: string) {
        // console.log((text || '').slice(0, 10))
        const node = new TextNode(text, current)
        current && current.children.push(node)
      },
      onclosetag(tag: string) {
        // console.log(`  /${tag}`)
        current = current && current.parent
      }
    }, { decodeEntities: true })
    parser.write(html.trim())
    parser.end()
    return root
  }
}
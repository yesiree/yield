import { BaseNode } from "./base-node.class";
import { NodeTypes } from "./node-types.enum";

export class RootNode extends BaseNode {
  constructor(
    parent: BaseNode | null = null,
    children: BaseNode[] = []
  ) {
    super(NodeTypes.Root, parent, children)
  }

  clone(parent: BaseNode | null = null): RootNode {
    const node = new RootNode(parent)
    node.setChildren(this.children.map(c => c.clone(node)))
    return node
  }
}
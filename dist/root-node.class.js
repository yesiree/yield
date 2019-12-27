"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_node_class_1 = require("./base-node.class");
var node_types_enum_1 = require("./node-types.enum");
var RootNode = /** @class */ (function (_super) {
    __extends(RootNode, _super);
    function RootNode(parent, children) {
        if (parent === void 0) { parent = null; }
        if (children === void 0) { children = []; }
        return _super.call(this, node_types_enum_1.NodeTypes.Root, parent, children) || this;
    }
    RootNode.prototype.clone = function (parent) {
        if (parent === void 0) { parent = null; }
        var node = new RootNode(parent);
        node.setChildren(this.children.map(function (c) { return c.clone(node); }));
        return node;
    };
    return RootNode;
}(base_node_class_1.BaseNode));
exports.RootNode = RootNode;

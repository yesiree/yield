"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlparser2_1 = require("htmlparser2");
var element_node_class_1 = require("./element-node.class");
var text_node_class_1 = require("./text-node.class");
var root_node_class_1 = require("./root-node.class");
var directive_node_class_1 = require("./directive-node.class");
var node_types_enum_1 = require("./node-types.enum");
var NodeUtils = /** @class */ (function () {
    function NodeUtils() {
    }
    NodeUtils.clone = function (node) {
        // FIX: TEMP SOLUTION FOR DEEP COPY
        var clone = NodeUtils.parse(node.serialize());
        if (node.type !== node_types_enum_1.NodeTypes.Root) {
            clone = clone.children.pop() || {};
        }
        return clone;
    };
    NodeUtils.serialize = function (nodes) {
        return new root_node_class_1.RootNode(null, nodes).serialize();
    };
    NodeUtils.parse = function (html, root) {
        if (root === void 0) { root = new root_node_class_1.RootNode(); }
        var current = root;
        var parser = new htmlparser2_1.Parser({
            onprocessinginstruction: function (name, data) {
                var node = new directive_node_class_1.DirectiveNode(name, data);
                current && current.children.push(node);
            },
            onopentag: function (tag, attrs) {
                // console.log(`>${tag}`)
                var node = new element_node_class_1.ElementNode(tag, attrs, current);
                current && current.children.push(node);
                current = node;
            },
            ontext: function (text) {
                // console.log((text || '').slice(0, 10))
                var node = new text_node_class_1.TextNode(text, current);
                current && current.children.push(node);
            },
            onclosetag: function (tag) {
                // console.log(`  /${tag}`)
                current = current && current.parent;
            }
        }, { decodeEntities: true });
        parser.write(html.trim());
        parser.end();
        return root;
    };
    return NodeUtils;
}());
exports.NodeUtils = NodeUtils;

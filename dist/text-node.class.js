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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_node_class_1 = require("./base-node.class");
var node_types_enum_1 = require("./node-types.enum");
var chalk_1 = __importDefault(require("chalk"));
var TextNode = /** @class */ (function (_super) {
    __extends(TextNode, _super);
    function TextNode(text, parent) {
        if (text === void 0) { text = ''; }
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, node_types_enum_1.NodeTypes.Text, parent, []) || this;
        _this.text = text;
        return _this;
    }
    TextNode.prototype.clone = function (parent) {
        if (parent === void 0) { parent = null; }
        return new TextNode(this.text.slice(), parent);
    };
    TextNode.prototype.toString = function () {
        return chalk_1.default.gray("[TEXT NODE]");
    };
    TextNode.prototype.serialize = function (minify) {
        if (minify === void 0) { minify = false; }
        return minify
            ? this.text.replace(/\s+/g, ' ')
            : this.text;
    };
    return TextNode;
}(base_node_class_1.BaseNode));
exports.TextNode = TextNode;

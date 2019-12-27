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
var DirectiveNode = /** @class */ (function (_super) {
    __extends(DirectiveNode, _super);
    function DirectiveNode(name, data, parent) {
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, node_types_enum_1.NodeTypes.Directive, parent, []) || this;
        _this.name = name;
        _this.data = data;
        _this.name = name;
        _this.data = data;
        return _this;
    }
    DirectiveNode.prototype.clone = function (parent) {
        if (parent === void 0) { parent = null; }
        return new DirectiveNode(this.name.slice(), this.data.slice(), parent);
    };
    DirectiveNode.prototype.toString = function () {
        return chalk_1.default.yellow("<" + this.data + ">");
    };
    DirectiveNode.prototype.serialize = function () {
        return "<" + this.data + ">";
    };
    DirectiveNode.prototype._matchesSegment = function (segment) {
        return segment.tokens.every(function (token) {
            return !token.sign;
            // let match = false
            // switch (token.type) {
            //   case SelectorTokenTypes.Element:
            //     match = token.value === this.tag
            //     break
            //   case SelectorTokenTypes.Attribute:
            //     match = token.value in (this.attrs || {})
            //     break
            // }
            // return token.sign ? match : !match
        });
    };
    return DirectiveNode;
}(base_node_class_1.BaseNode));
exports.DirectiveNode = DirectiveNode;

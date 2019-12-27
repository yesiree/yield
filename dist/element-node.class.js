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
var selector_token_types_enum_1 = require("./selector-token-types.enum");
var chalk = require("chalk");
var ElementNode = /** @class */ (function (_super) {
    __extends(ElementNode, _super);
    function ElementNode(tag, attrs, parent, children) {
        if (parent === void 0) { parent = null; }
        if (children === void 0) { children = []; }
        var _this = _super.call(this, node_types_enum_1.NodeTypes.Element, parent, children) || this;
        _this.tag = tag;
        _this.id = undefined;
        _this.classes = [];
        _this.tag = tag;
        _this.attrs = attrs || {};
        _this.id = _this.attrs.id;
        _this.classes = _this.attrs.class
            ? _this.attrs.class.split(/\s/g)
            : [];
        return _this;
    }
    ElementNode.prototype.clone = function (parent) {
        var _this = this;
        if (parent === void 0) { parent = null; }
        var attrs = {};
        Object
            .keys(this.attrs)
            .forEach(function (key) { return attrs[key] = _this.attrs[key].slice(); });
        var node = new ElementNode(this.tag.slice(), attrs, parent);
        node.setChildren(this.children.map(function (c) { return c.clone(node); }));
        return node;
    };
    ElementNode.prototype.removeAttr = function (key) {
        var value = this.attrs[key];
        delete this.attrs[key];
        return value;
    };
    ElementNode.prototype.replaceWithChildren = function () {
        this.replaceWith(this.children);
    };
    ElementNode.prototype.toString = function () {
        return chalk.green("<" + this.tag + ">");
        // let identity = `${super.toString()} ${this.tag}`
        // if (this.id) identity += `#${this.id}`
        // if (this.classes && this.classes.length) {
        //   identity += `.${this.classes.join('.')}`
        // }
        // return identity
    };
    ElementNode.prototype._matchesSegment = function (segment) {
        var _this = this;
        return segment.tokens.every(function (token) {
            var match = false;
            switch (token.type) {
                case selector_token_types_enum_1.SelectorTokenTypes.Element:
                    match = token.value === _this.tag;
                    break;
                case selector_token_types_enum_1.SelectorTokenTypes.Attribute:
                    match = token.value in (_this.attrs || {});
                    break;
            }
            return token.sign ? match : !match;
        });
    };
    ElementNode.prototype._serializeAttrs = function () {
        var _this = this;
        var attrs = Object
            .keys(this.attrs)
            .map(function (key) {
            var value = _this.attrs[key];
            return value
                ? key + "=\"" + value + "\""
                : key;
        })
            .join(' ');
        return attrs ? " " + attrs : '';
    };
    ElementNode.prototype.serialize = function (minify) {
        if (minify === void 0) { minify = false; }
        if (this.tag === base_node_class_1.BaseNode.templateTagName) {
            return this._serializeChildren(minify);
        }
        var attrs = this._serializeAttrs();
        return "<" + this.tag + attrs + ">"
            + this._serializeChildren(minify)
            + ("</" + this.tag + ">");
    };
    return ElementNode;
}(base_node_class_1.BaseNode));
exports.ElementNode = ElementNode;

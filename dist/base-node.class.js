"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_types_enum_1 = require("./node-types.enum");
var selector_class_1 = require("./selector.class");
var chalk = require("chalk");
var BaseNode = /** @class */ (function () {
    function BaseNode(type, parent, children) {
        if (parent === void 0) { parent = null; }
        if (children === void 0) { children = []; }
        this.type = type;
        this.parent = parent;
        this.children = children;
    }
    BaseNode.prototype.clone = function (parent) {
        if (parent === void 0) { parent = null; }
        var node = new BaseNode(this.type, parent);
        node.setChildren(this.children.map(function (c) { return c.clone(node); }));
        return node;
    };
    BaseNode.prototype.setChildren = function (children) {
        var _a;
        (_a = this.children).splice.apply(_a, __spread([0, this.children.length], children));
    };
    BaseNode.prototype.insertAfter = function (nodes) {
        var _a;
        var _this = this;
        if (!Array.isArray(nodes))
            nodes = [nodes];
        if (!this.parent)
            return;
        var index = this.parent.children.indexOf(this);
        (_a = this.parent.children).splice.apply(_a, __spread([index, 0], nodes));
        nodes.forEach(function (n) { return n.parent = _this.parent; });
    };
    BaseNode.prototype.replaceWith = function (nodes) {
        var _a;
        var _this = this;
        if (!Array.isArray(nodes))
            nodes = [nodes];
        if (!this.parent)
            return;
        var index = this.parent.children.indexOf(this);
        (_a = this.parent.children).splice.apply(_a, __spread([index, 1], nodes));
        nodes.forEach(function (n) { return n.parent = _this.parent; });
    };
    BaseNode.prototype.remove = function () {
        if (!this.parent)
            return;
        var index = this.parent.children.indexOf(this);
        this.parent.children.splice(index, 1);
        this.parent = null;
    };
    BaseNode.prototype.toString = function () {
        return "[" + this.type.toUpperCase() + "]";
    };
    BaseNode.prototype.toTreeString = function (depth) {
        if (depth === void 0) { depth = 0; }
        var indent = '  '.repeat(depth);
        return "" + indent + chalk.blueBright(this.toString()) + "\n"
            + this.children
                .filter(function (x) { return x.type !== node_types_enum_1.NodeTypes.Text; })
                .map(function (n) { return n.toTreeString(depth + 1); })
                .join('');
    };
    BaseNode.prototype.serialize = function (minify) {
        if (minify === void 0) { minify = false; }
        return this._serializeChildren(minify);
    };
    BaseNode.prototype._getWhitespace = function (indent, depth) {
        return typeof indent === 'string'
            ? indent
            : ' '.repeat(indent).repeat(depth);
    };
    BaseNode.prototype._serializeChildren = function (minify) {
        if (minify === void 0) { minify = false; }
        return this.children
            .map(function (x) { return x.serialize(minify); })
            .join('');
    };
    Object.defineProperty(BaseNode.prototype, "innerHTML", {
        get: function () {
            return this._serializeChildren();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseNode.prototype, "outerHTML", {
        get: function () {
            return this.serialize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseNode.prototype, "minified", {
        get: function () {
            return this.serialize(true);
        },
        enumerable: true,
        configurable: true
    });
    BaseNode.prototype.queryChildren = function (selectorStrs) {
        var _this = this;
        var results = [];
        selectorStrs.split(/,/g).forEach(function (selectorStr) {
            var selector = _this._memoizeSelectors(selectorStr);
            var segment = selector.segments[0];
            if (!segment || selector.segments.length > 1)
                return;
            _this.children.forEach(function (node) {
                if (node._matchesSegment(segment)) {
                    results.push(node);
                }
            });
        });
        return results;
    };
    BaseNode.prototype.queryAll = function (selectorStrs) {
        var _this = this;
        var results = [];
        selectorStrs.split(/,/g).forEach(function (selectorStr) {
            var e_1, _a;
            var selector = _this._memoizeSelectors(selectorStr);
            var found = [_this];
            try {
                for (var selector_1 = __values(selector), selector_1_1 = selector_1.next(); !selector_1_1.done; selector_1_1 = selector_1.next()) {
                    var segment = selector_1_1.value;
                    if (!segment)
                        continue;
                    results.push.apply(results, __spread(_this._matchAll(segment, found)));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (selector_1_1 && !selector_1_1.done && (_a = selector_1.return)) _a.call(selector_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        return results;
    };
    BaseNode.prototype._matchAll = function (segment, nodes) {
        var _this = this;
        if (nodes === void 0) { nodes = []; }
        if (!nodes.length)
            return [];
        var found = [];
        nodes.forEach(function (node) {
            if (node._matchesSegment(segment)) {
                found.push(node);
            }
            found.push.apply(found, __spread(_this._matchAll(segment, node.children)));
        });
        return found;
    };
    BaseNode.prototype._matchesSegment = function (segment) {
        return false;
    };
    BaseNode.prototype._memoizeSelectors = function (selectorStr) {
        var selector = BaseNode.SELECTOR_CACHE[selectorStr];
        if (!selector) {
            selector = BaseNode.SELECTOR_CACHE[selectorStr] = new selector_class_1.Selector(selectorStr);
        }
        return selector;
    };
    BaseNode.templateTagName = '#template';
    BaseNode.SELECTOR_CACHE = {};
    return BaseNode;
}());
exports.BaseNode = BaseNode;

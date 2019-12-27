"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yaml = __importStar(require("js-yaml"));
var marked_1 = __importDefault(require("marked"));
var highlight_js_1 = __importDefault(require("highlight.js"));
var expression = __importStar(require("expression-eval"));
var element_node_class_1 = require("./element-node.class");
var base_node_class_1 = require("./base-node.class");
var text_node_class_1 = require("./text-node.class");
var node_types_enum_1 = require("./node-types.enum");
var node_utils_class_1 = require("./node-utils.class");
marked_1.default.setOptions({
    highlight: function (code) {
        return highlight_js_1.default.highlightAuto(code).value;
    },
    // headerIds: true,
    // gfm: true,
    smartLists: true,
    smartypants: true
});
var forEachAttrKey = '#foreach';
var ifAttrKey = '#if';
var slotAttrKey = '#slot';
var primarySlotKey = Symbol('Symbol.primarySlotKey');
var captureFmRegex = /^---\s*$([\s\S]*?)^---\s*$([\s\S]*)/m;
var captureInterpolation = /{{(.*?)}}/g;
var Page = /** @class */ (function () {
    function Page(file) {
        this.meta = {};
        var _a = __read(captureFmRegex.exec(file.content) || [], 3), head = _a[1], _b = _a[2], body = _b === void 0 ? file.content : _b;
        this.meta = Object.assign({ markdown: true }, head && yaml.load(head) || {});
        this.layout = this.meta.layout;
        delete this.meta.layout;
        delete this.meta.slot;
        this.dom = node_utils_class_1.NodeParser.parse(this.meta.markdown ? marked_1.default(body) : body);
    }
    Page.prototype._eval = function (expr, context) {
        try {
            return expression.compile(expr)(context);
        }
        catch (e) {
            var message = e && typeof e === 'object'
                ? e.message
                : '' + e;
            throw Error("Error in interpolation expression: \"" + expr + "\"\n  " + message);
        }
        // TODO: pipe chain stuff
    };
    Page.prototype._interpretNode = function (node, context, inserts) {
        var _this = this;
        if (node instanceof element_node_class_1.ElementNode) {
            var _a = node.attrs, _b = forEachAttrKey, forEachAttr = _a[_b], _c = ifAttrKey, ifExpr = _a[_c], _d = slotAttrKey, slotAttr = _a[_d];
            if (forEachAttr) {
                delete node.attrs[forEachAttrKey];
                var _e = __read(forEachAttr.split(/\s/g), 3), itemKey_1 = _e[0], arrExpr = _e[2];
                var arr = this._eval(arrExpr, context);
                var children = arr.map(function (item) {
                    var _a;
                    var child = node_utils_class_1.NodeParser.clone(node);
                    var childContext = Object.assign({}, context, (_a = {}, _a[itemKey_1] = item, _a));
                    _this._interpretNode(child, childContext, inserts);
                    return child;
                });
                node.replaceWith(children);
                return;
            }
            if (ifExpr) {
                delete node.attrs[ifAttrKey];
                if (!this._eval(ifExpr, context)) {
                    node.remove();
                    return;
                }
            }
            if (typeof slotAttr === 'string') {
                var insert = inserts[slotAttr || primarySlotKey];
                if (insert)
                    node.children = [insert];
                return;
            }
            Object.keys(node.attrs).forEach(function (key) {
                node.attrs[key].replace(captureInterpolation, function (m, expr) {
                    return _this._eval(expr, context);
                });
            });
            node.children.forEach(function (x) { return _this._interpretNode(x, context, inserts); });
        }
        else if (node instanceof text_node_class_1.TextNode) {
            node.text = node.text.replace(captureInterpolation, function (m, expr) {
                return _this._eval(expr, context);
            });
        }
        else if (node instanceof base_node_class_1.BaseNode
            && node.type === node_types_enum_1.NodeTypes.Root) {
            node.children.forEach(function (x) {
                _this._interpretNode(x, context, inserts);
            });
        }
    };
    Page.prototype._interpret = function (context, layouts, inserts) {
        return __awaiter(this, void 0, void 0, function () {
            var isLayout, outsert, clone, primaryNodes, layout;
            return __generator(this, function (_a) {
                isLayout = !!inserts;
                if (isLayout) {
                    context = Object.assign({}, this.meta, context);
                }
                else {
                    context = Object.assign({}, context, this.meta);
                }
                outsert = {};
                clone = node_utils_class_1.NodeParser.clone(this.dom);
                this._interpretNode(clone, context, inserts || {});
                clone.queryChildren('[#insert]').forEach(function (node) {
                    if (!(node instanceof element_node_class_1.ElementNode))
                        return;
                    var slotKey = node.attrs['#insert'];
                    outsert[slotKey] = node;
                });
                primaryNodes = clone.queryChildren('![#insert]');
                outsert[primarySlotKey] = new element_node_class_1.ElementNode(base_node_class_1.BaseNode.templateTagName, {}, null, primaryNodes);
                if (this.layout) {
                    // todo
                }
                layout = this.layout && layouts[this.layout] || null;
                if (layout) {
                    return [2 /*return*/, layout._interpret(context, layouts, outsert)];
                }
                return [2 /*return*/, outsert
                    // TODO expression | pipe-chain : args
                ];
            });
        });
    };
    Page.prototype.render = function (context, layouts) {
        return this
            ._interpret(context, layouts)
            .then(function (inserts) {
            return inserts[primarySlotKey].minified;
        });
    };
    return Page;
}());
exports.Page = Page;

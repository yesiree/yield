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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
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
var expression = __importStar(require("expression-eval"));
var yaml = __importStar(require("js-yaml"));
var marked_1 = __importDefault(require("marked"));
var highlight_js_1 = __importDefault(require("highlight.js"));
var pipes_const_1 = require("./pipes.const");
var element_node_class_1 = require("./element-node.class");
var node_utils_class_1 = require("./node-utils.class");
var base_node_class_1 = require("./base-node.class");
var text_node_class_1 = require("./text-node.class");
var node_types_enum_1 = require("./node-types.enum");
var timer_class_1 = require("./timer.class");
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
var Generator = /** @class */ (function () {
    function Generator(config) {
        this.checkTime = false;
        this.timer = new timer_class_1.Timer();
        this.getPage = config.getPage;
        this.getData = config.getData;
        this.pipes = Object.assign(pipes_const_1.DefaultPipes, config.pipes);
    }
    Generator.prototype.render = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var time, outserts, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        time = this.checkTime && true;
                        time && this.timer.start('render');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._interpret(path)];
                    case 2:
                        outserts = _a.sent();
                        time && this.timer.log('render');
                        return [2 /*return*/, outserts[primarySlotKey].minified];
                    case 3:
                        e_1 = _a.sent();
                        // TODO: log out nice little error messages
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Generator.prototype._interpret = function (path, context, inserts) {
        return __awaiter(this, void 0, void 0, function () {
            var time, page, _a, dom, meta, layout, isLayout, clone, outserts, primaryNodes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        time = this.checkTime && true;
                        time && this.timer.start('_interpret');
                        return [4 /*yield*/, this.getPage(path)];
                    case 1:
                        page = _b.sent();
                        return [4 /*yield*/, this._parse(page)];
                    case 2:
                        _a = _b.sent(), dom = _a.dom, meta = _a.meta, layout = _a.layout;
                        isLayout = !!inserts;
                        context = isLayout
                            ? Object.assign({}, meta, context)
                            : Object.assign({}, context, meta);
                        clone = node_utils_class_1.NodeUtils.clone(dom);
                        this._interpretNode(clone, context, inserts || {});
                        outserts = clone
                            .queryChildren('[#insert]')
                            .reduce(function (outserts, node) {
                            if (node instanceof element_node_class_1.ElementNode) {
                                var slotKey = node.attrs['#insert'];
                                outserts[slotKey] = node;
                            }
                            return outserts;
                        }, {});
                        primaryNodes = clone.queryChildren('![#insert]');
                        outserts[primarySlotKey] = new element_node_class_1.ElementNode(base_node_class_1.BaseNode.templateTagName, {}, null, primaryNodes);
                        if (layout) {
                            time && this.timer.log('_interpret');
                            return [2 /*return*/, this._interpret(layout, context, outserts)];
                        }
                        time && this.timer.log('_interpret');
                        return [2 /*return*/, outserts];
                }
            });
        });
    };
    Generator.prototype._interpretNode = function (node, context, inserts) {
        var _this = this;
        var time = this.checkTime && true;
        time && this.timer.start('_interpretNode ' + node.toString());
        if (node instanceof element_node_class_1.ElementNode) {
            var _a = node.attrs, _b = forEachAttrKey, forEachAttr = _a[_b], _c = ifAttrKey, ifExpr = _a[_c], _d = slotAttrKey, slotAttr = _a[_d];
            if (forEachAttr) {
                delete node.attrs[forEachAttrKey];
                var _e = __read(forEachAttr.split(/\s/g), 3), itemKey_1 = _e[0], arrExpr = _e[2];
                var arr = this._eval(arrExpr, context);
                arr.map(function (item) {
                    var _a;
                    var child = node.clone();
                    node.insertAfter(child);
                    var childContext = Object.assign({}, context, (_a = {}, _a[itemKey_1] = item, _a));
                    _this._interpretNode(child, childContext, inserts);
                    return child;
                });
                node.remove();
                time && this.timer.log('_interpretNode ' + node.toString());
                return;
            }
            if (ifExpr) {
                delete node.attrs[ifAttrKey];
                if (!this._eval(ifExpr, context)) {
                    node.remove();
                    time && this.timer.log('_interpretNode ' + node.toString());
                    return;
                }
            }
            if (typeof slotAttr === 'string') {
                var insert = inserts[slotAttr || primarySlotKey];
                if (insert)
                    node.children = [insert];
                time && this.timer.log('_interpretNode ' + node.toString());
                return;
            }
            Object.keys(node.attrs).forEach(function (key) {
                node.attrs[key].replace(captureInterpolation, function (m, expr) {
                    return _this._eval(expr, context);
                });
            });
            node.children.forEach(function (x) { return _this._interpretNode(x, context, inserts); });
            time && this.timer.log('_interpretNode ' + node.toString());
        }
        else if (node instanceof text_node_class_1.TextNode) {
            node.text = node.text.replace(captureInterpolation, function (m, expr) {
                return _this._eval(expr, context);
            });
            time && this.timer.log('_interpretNode ' + node.toString());
        }
        else if (node instanceof base_node_class_1.BaseNode
            && node.type === node_types_enum_1.NodeTypes.Root) {
            node.children.forEach(function (x) {
                _this._interpretNode(x, context, inserts);
            });
            time && this.timer.log('_interpretNode ' + node.toString());
        }
    };
    Generator.prototype._parse = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var time, _a, head, _b, body, meta, layout, dom, data;
            var _this = this;
            return __generator(this, function (_c) {
                time = this.checkTime && true;
                time && this.timer.start("_parse " + page.path);
                _a = __read(captureFmRegex.exec(page.content) || [], 3), head = _a[1], _b = _a[2], body = _b === void 0 ? page.content : _b;
                meta = Object.assign({}, head && yaml.load(head) || {});
                layout = meta.layout;
                delete meta.layout;
                dom = node_utils_class_1.NodeUtils.parse(meta.markdown ? marked_1.default(body) : body);
                data = meta.data || {};
                delete meta.data;
                return [2 /*return*/, Promise.all(Object.keys(data).map(function (key) {
                        return Promise
                            .resolve(_this.getData(data[key]))
                            .then(function (value) { return ({ key: key, value: value }); });
                    })).then(function (args) {
                        meta.data = args.reduce(function (data, item) {
                            data[item.key] = item.value;
                            return data;
                        }, {});
                        time && _this.timer.log("_parse " + page.path);
                        return { dom: dom, meta: meta, layout: layout };
                    })];
            });
        });
    };
    Generator.prototype._eval = function (statement, context) {
        var _this = this;
        var time = this.checkTime && true;
        time && this.timer.start("_eval: " + statement);
        try {
            var _a = __read(statement.split(/\|/g)), expr = _a[0], pipes = _a.slice(1);
            var value = expression.compile(expr)(context);
            value = pipes.reduce(function (result, pipe) {
                var _a = __read(pipe.split(/:/g).map(function (x) { return x.trim(); })), fnKey = _a[0], args = _a.slice(1);
                var fn = _this.pipes[fnKey];
                if (!fn)
                    throw Error("Pipe function '" + fnKey + " not found!");
                return fn.apply(void 0, __spread([result], args.map(function (x) { return expression.compile(x)(context); })));
            }, value);
            time && this.timer.log("_eval: " + statement);
            return value;
        }
        catch (e) {
            var message = e && typeof e === 'object'
                ? e.message
                : '' + e;
            throw Error("\nSyntax error in expression: \"" + statement + "\"\n  " + message);
        }
    };
    return Generator;
}());
exports.Generator = Generator;

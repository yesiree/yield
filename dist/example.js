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
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var timer_class_1 = require("./timer.class");
var pages = {
    'layout': "---\ntitle: Layout Title\n---\n<!doctype html>\n<html>\n  <head>\n    <title>{{ title | title }}</title>\n  </head>\n  <body>\n    <header>\n      <nav>\n        <a href=\"/\">home</a>\n        <a href=\"/one\">one</a>\n        <a href=\"/two\">two</a>\n      </nav>\n    </header>\n    <main #slot></main>\n  </body>\n</html>",
    'marked': "---\nmarkdown: true\n---\n# Header 1\n\nA simple little paragraph\n\n - one\n - two\n - three\n\n> Blockquote!\n",
    'index': "---\nlayout: layout\ntitle: I am the title.\nname: World\nitems:\n  - apple\n  - banana\n  - cherry\ndata:\n  enums: enums\n---\n<div>\n  <div>\n    {{ items | sort: 'desc' | join: ', ' }}\n  </div>\n  <ul>\n    <li #foreach=\"item of items\"\n          #if=\"item !== 'banana'\">\n      Hello {{ item }}\n    </li>\n  </ul>\n  # Header!\n  <div #foreach=\"item of data.enums.colors\">\n    <h1>{{ item }}</h1>\n  </div>\n</div>"
};
var data = {
    enums: {
        colors: ['red', 'green', 'blue'],
        fruit: ['apple', 'banana', 'cherry']
    }
};
var generator = new _1.Generator({
    getPage: function (path) {
        return {
            path: path,
            content: pages[path]
        };
    },
    getData: function (path) {
        return data[path];
    },
    pipes: {}
});
var exec = function () { return __awaiter(void 0, void 0, void 0, function () {
    var timer, output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                timer = new timer_class_1.Timer();
                timer.start('Example');
                return [4 /*yield*/, generator.render('index')];
            case 1:
                output = _a.sent();
                require('fs').writeFileSync('index.html', output);
                timer.log('Example');
                return [2 /*return*/];
        }
    });
}); };
exec();

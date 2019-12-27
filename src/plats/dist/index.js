"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_watcher_1 = require("./rxjs-watcher");
// const watcher = chokidar.watch('./**/*')
// const newFiles$ = ObservablefromEvent(watcher, 'add')
// const changedFiles$ = fromEvent(watcher, 'change')
exports.plats = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.src, src = _c === void 0 ? '' : _c, _d = _b.dest, dest = _d === void 0 ? '' : _d;
    return rxjs_watcher_1.watch$(src);
};

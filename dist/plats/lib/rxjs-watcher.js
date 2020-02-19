"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chokidar_1 = require("chokidar");
var rxjs_1 = require("rxjs");
var path_1 = require("path");
function watch$(pattern, options) {
    if (options === void 0) { options = {}; }
    var _a = options.cwd, cwd = _a === void 0 ? process.cwd() : _a;
    return rxjs_1.Observable.create(function (observer) {
        var watcher = chokidar_1.watch(pattern, options);
        var next = function (type) { return function (name) {
            var path = name.replace(/\\/g, '/');
            var filename = path_1.basename(name);
            var ext = path_1.extname(filename);
            var key = path_1.join(cwd, path);
            return observer.next({
                type: type,
                key: key,
                path: path,
                cwd: cwd,
                filename: filename,
                ext: ext,
            });
        }; };
        ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(function (type) {
            watcher.on(type, next(type));
        });
        watcher.on('error', function (err) {
            observer.error(err);
            watcher.close();
        });
    });
}
exports.watch$ = watch$;

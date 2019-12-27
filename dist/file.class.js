"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var File = /** @class */ (function () {
    function File(path, filename, ext, content) {
        this.path = path;
        this.filename = filename;
        this.ext = ext;
        this.content = content;
    }
    return File;
}());
exports.File = File;

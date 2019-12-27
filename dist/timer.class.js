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
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var Timer = /** @class */ (function () {
    function Timer() {
        this.timers = {};
    }
    Timer.prototype.start = function (label) {
        return this.timers[label] = process.hrtime();
    };
    Timer.prototype.end = function (label) {
        var start = this.timers[label];
        return process.hrtime(start);
    };
    Timer.prototype.log = function (label) {
        var start = this.timers[label];
        var _a = __read(process.hrtime(start), 2), s = _a[0], ms = _a[1];
        var l = label + ':';
        var t = ('' + (s + (ms / 1000000)));
        console.log("[" + chalk.cyan(l) + " " + chalk.magenta(t + ' ms') + "]");
    };
    return Timer;
}());
exports.Timer = Timer;

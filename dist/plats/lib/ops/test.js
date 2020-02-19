"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var pow = function (n) { return function (source) {
    return new rxjs_1.Observable(function (dest) {
        return source.subscribe({
            next: function (x) {
                dest.next(Math.pow(x, n));
            },
            error: function (err) { dest.error(err); },
            complete: function () { dest.complete(); }
        });
    });
}; };

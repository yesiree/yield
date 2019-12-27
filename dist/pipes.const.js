"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getType = function (val) {
    if (val === null)
        return 'null';
    if (val !== val)
        return 'nan';
    if (val instanceof Date)
        return 'date';
    if (Array.isArray(val))
        return 'array';
    return typeof val;
};
var compareFns = {
    compare_string_asc: function (prop, a, b) {
        if (prop)
            a = a[prop], b = b[prop];
        return a.localeCompare(b);
    },
    compare_string_desc: function (prop, a, b) {
        if (prop)
            a = a[prop], b = b[prop];
        return b.localeCompare(a);
    },
    compare_number_asc: function (prop, a, b) {
        if (prop)
            a = a[prop], b = b[prop];
        return a - b;
    },
    compare_number_desc: function (prop, a, b) {
        if (prop)
            a = a[prop], b = b[prop];
        return b - a;
    },
    compare_date_asc: function (prop, a, b) {
        if (prop)
            a = a[prop], b = b[prop];
        return a.getTime() - b.getTime();
    },
    compare_date_desc: function (prop, a, b) {
        if (prop)
            a = a[prop], b = b[prop];
        return b.getTime() - a.getTime();
    }
};
exports.DefaultPipes = {
    lower: function (value) {
        return value.toLowerCase();
    },
    upper: function (value) {
        return value.toUpperCase();
    },
    title: function (value) {
        var inWord = false;
        var result = '';
        for (var i = 0; i < value.length; i++) {
            var ch = value.charAt(i);
            var chUpper = ch.toUpperCase();
            var chLower = ch.toLowerCase();
            if (chUpper !== chLower) {
                if (inWord)
                    result += chLower;
                else {
                    inWord = true;
                    result += chUpper;
                }
            }
            else {
                inWord = false;
                result += ch;
            }
        }
        return result;
    },
    trim: function (value) {
        return value.trim();
    },
    truncate: function (value, max) {
        max = +max;
        if (value.length <= max)
            return value;
        return value.slice(0, max - 3) + '...';
    },
    slice: function (value, start, end) {
        start = start !== undefined ? +start : start;
        end = end !== undefined ? +end : end;
        return value.slice(start, end);
    },
    split: function (value, sep) {
        return value.split(sep);
    },
    size: function (value) {
        return value.length;
    },
    first: function (value) {
        return value[0];
    },
    last: function (value) {
        return value[value.length - 1];
    },
    join: function (value, sep) {
        return value.join(sep);
    },
    filter: function (value, prop, val) {
        return value.filter(function (x) { return x[prop] = val; });
    },
    sort: function (value, prop, order) {
        if (order === void 0) { order = 'asc'; }
        var type = getType(value[0]);
        if (type === 'object') {
            type = getType(value[0][prop]);
            if (!prop)
                throw Error("Must provide an object property key when sorting array of objects.");
        }
        else {
            order = prop || 'asc';
            prop = '';
        }
        if (type !== 'string' && type !== 'number' && type !== 'date') {
            throw Error("Unable to sort arrays of '" + type + "'.");
        }
        if (order !== 'asc' && order !== 'desc') {
            throw Error("Invalid order: '" + order + "'. Must be either 'asc' or 'desc'.");
        }
        var compareFn = compareFns["compare_" + type + "_" + order];
        return value.slice().sort(compareFn.bind(null, prop));
    },
    round: function (value) {
        return Math.round(+value);
    },
    floor: function (value) {
        return Math.floor(+value);
    },
    ceil: function (value) {
        return Math.ceil(+value);
    },
    fallback: function (value, fallback) {
        return value || fallback;
    },
    date: function (value, format) {
        return "[NOT YET IMPLEMENTED!]";
    }
};

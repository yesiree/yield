"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selector_token_types_enum_1 = require("./selector-token-types.enum");
var selector_segment_class_1 = require("./selector-segment.class");
var selector_token_class_1 = require("./selector-token.class");
var Selector = /** @class */ (function () {
    function Selector(str) {
        this.segments = [];
        this.segments = str
            .split(/\s/g)
            .map(function (segment) {
            var tokens = [];
            var sign = true;
            var type = selector_token_types_enum_1.SelectorTokenTypes.Element;
            var value = '';
            for (var i = 0; i < segment.length; i++) {
                var ch = segment.charAt(i);
                if (!Selector._SEPARATORS.includes(ch) ||
                    (ch !== ']' && type === selector_token_types_enum_1.SelectorTokenTypes.Attribute)) {
                    value += ch;
                }
                else {
                    if (value) {
                        tokens.push(new selector_token_class_1.SelectorToken(sign, type, value));
                        value = '';
                        sign = true;
                    }
                    switch (ch) {
                        case '!':
                            sign = false;
                            break;
                        case '[':
                            type = selector_token_types_enum_1.SelectorTokenTypes.Attribute;
                            break;
                        default: type = selector_token_types_enum_1.SelectorTokenTypes.Element;
                    }
                }
            }
            if (value) {
                tokens.push(new selector_token_class_1.SelectorToken(sign, type, value));
            }
            return new selector_segment_class_1.SelectorSegment(tokens);
        });
    }
    Selector.prototype[Symbol.iterator] = function () {
        var index = 0;
        var self = this;
        return {
            next: function () {
                return index < self.segments.length
                    ? { done: false, value: self.segments[index++] }
                    : { done: true };
            }
        };
    };
    Selector.prototype.toString = function () {
        return this.segments.map(function (x) { return x.toString(); }).join(' ');
    };
    Selector._SEPARATORS = ['[', ']', '!'];
    return Selector;
}());
exports.Selector = Selector;

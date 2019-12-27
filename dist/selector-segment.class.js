"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selector_token_types_enum_1 = require("./selector-token-types.enum");
var SelectorSegment = /** @class */ (function () {
    function SelectorSegment(tokens) {
        this.tokens = tokens;
    }
    SelectorSegment.prototype.toString = function () {
        return this.tokens.map(function (x) {
            var sign = x.sign ? '' : '!';
            switch (x.type) {
                case selector_token_types_enum_1.SelectorTokenTypes.Element: return sign + "<" + x.value + ">";
                case selector_token_types_enum_1.SelectorTokenTypes.Attribute: return sign + "[" + x.value + "]";
            }
        }).join('');
    };
    return SelectorSegment;
}());
exports.SelectorSegment = SelectorSegment;

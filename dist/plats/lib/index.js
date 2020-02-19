"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_watcher_1 = require("./rxjs-watcher");
exports.plats = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.src, src = _c === void 0 ? '' : _c, _d = _b.dest, dest = _d === void 0 ? '' : _d;
    var data = {};
    var layouts = {};
    var pages = {};
    return rxjs_watcher_1.watch$(src)
        .pipe(
    // TODO
    );
};
/*
  directives
    *foreach
    *if
    *switch
      *case
      *default

  interpolation

    {{ expression | pipe-chain : args }}

  pipes
    plugins




  gather data from .json files
  gather layouts from .layout.html files
  gather pages from remaining .html files

  for each page
    parse front matter
    get layout for page
    get format for page
    get combined data (json files, front matter)
    if markdown format
      convert markdown
    process directives
    if layout
      get(layout)
      combine(layout, page)
    return page

  get(layout)
    get layout from hash
    if not processed
      process(layout)
    return layout

  process(layout)
    parse front matter
    get layout for layout
    get format for layout
    get combined data (json files, front matter)
    if markdown format
      convert markdown
    process directives
    if layout
      get(layout)
      combine(layout, layout)
    return layout
*/ 

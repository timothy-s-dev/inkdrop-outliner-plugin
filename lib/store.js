"use babel";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { INITIALIZE, TOGGLE, LOAD_NOTE, UPDATE_NOTE } from './actions';
var initialState = {
    isVisible: false,
    allHeaders: [],
};
var headerRegex = /\s*#+\s+.+/g;
var hashRegex = /#+/g;
var getHeaderText = function (headerText) {
    return headerText
        .trimStart()
        .replace(hashRegex, "")
        .trimStart();
};
var getHeaderLevel = function (headerText) {
    var trimmed = headerText.trimStart();
    for (var i = 0; i < trimmed.length; ++i) {
        if (trimmed[i] != '#') {
            return i;
        }
    }
    return -1;
};
var getHeaderParent = function (parentHeaders, level) {
    for (var i = level - 1; i > 0; --i) {
        if (parentHeaders[i])
            return parentHeaders[i];
    }
    return undefined;
};
var buildHeader = function (text, lineNo) {
    return {
        text: getHeaderText(text),
        children: [],
        level: getHeaderLevel(text),
        line: lineNo
    };
};
var getAllHeadersFromNote = function (noteText) {
    var headers = [];
    return noteText
        .map(function (text, lineNo) { return { text: text, lineNo: lineNo }; })
        .filter(function (line) { return line.text.match(headerRegex); })
        .map(function (line) {
        var level = getHeaderLevel(line.text);
        var newHeader = buildHeader(line.text, line.lineNo);
        if (level > 1) {
            newHeader.parent = getHeaderParent(headers, level);
            if (newHeader.parent) {
                newHeader.parent.children.push(newHeader);
            }
        }
        headers[level] = newHeader;
        return newHeader;
    }).sort(function (a, b) { return a.line - b.line; });
};
var getUpdatedHeadersFromNote = function (state, change, newText) {
    var lineDelta = change.text.length - (1 + change.to.line - change.from.line);
    var preHeaders = state.allHeaders
        .filter(function (h) { return h.line < change.from.line; })
        .map(function (h) { return __assign(__assign({}, h), { children: [], parent: undefined }); });
    var newHeaders = newText.split('\n')
        .map(function (text, lineNo) { return { text: text, lineNo: lineNo + change.from.line }; })
        .filter(function (line) { return line.text.match(headerRegex); })
        .map(function (line) { return buildHeader(line.text, line.lineNo); });
    var postHeaders = state.allHeaders
        .filter(function (h) { return h.line > change.to.line; })
        .map(function (h) { return __assign(__assign({}, h), { line: h.line + lineDelta, children: [], parent: undefined }); });
    var allNewHeaders = __spreadArrays(preHeaders, newHeaders, postHeaders);
    // Re-calculate parentage
    var parentHeaders = [];
    for (var i = 0; i < allNewHeaders.length; ++i) {
        var header = allNewHeaders[i];
        header.parent = getHeaderParent(parentHeaders, header.level);
        if (header.parent) {
            header.parent.children.push(header);
        }
        parentHeaders[header.level] = header;
    }
    return allNewHeaders;
};
export default (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case INITIALIZE:
            return __assign(__assign({}, state), { allHeaders: getAllHeadersFromNote(action.noteText) });
        case TOGGLE:
            return __assign(__assign({}, state), { isVisible: !state.isVisible });
        case LOAD_NOTE:
            return __assign(__assign({}, state), { allHeaders: getAllHeadersFromNote(action.change.text) });
        case UPDATE_NOTE:
            return __assign(__assign({}, state), { allHeaders: getUpdatedHeadersFromNote(state, action.change, action.newText) });
    }
    return state;
});

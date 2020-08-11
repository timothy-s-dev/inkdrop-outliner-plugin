"use babel";
export var getRootHeaders = function (state) {
    var topLevel = state.allHeaders.reduce(function (prev, curr) { return curr.level < prev ? curr.level : prev; }, 10);
    return state.allHeaders.filter(function (header) { return header.level === topLevel; });
};

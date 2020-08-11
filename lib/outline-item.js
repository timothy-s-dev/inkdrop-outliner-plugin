"use babel";
import React from "react";
var jumpToLine = function (lineNo) {
    var editor = inkdrop.getActiveEditor();
    if (editor) {
        var coords = editor.cm.charCoords({ line: lineNo, ch: 0 }, "local").top;
        var offset = editor.cm.getScrollerElement().offsetHeight / 4;
        editor.cm.setCursor(lineNo, 0, { scroll: false });
        editor.cm.scrollTo(null, coords - offset);
    }
};
var OutlineItem = function (props) {
    return (React.createElement("li", null,
        React.createElement("a", { title: props.header.text, onClick: function () { return jumpToLine(props.header.line); } }, props.header.text),
        props.header.children.length > 0 &&
            React.createElement("ul", null, props.header.children.map(function (h) { return React.createElement(OutlineItem, { header: h }); }))));
};
export default OutlineItem;

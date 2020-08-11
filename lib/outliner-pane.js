"use babel";
import * as React from "react";
import { useSelector } from 'react-redux';
import Settings from "./settings";
import { getRootHeaders } from "./selectors";
import OutlineItem from "./outline-item";
export default (function (props) {
    var isVisible = useSelector(function (state) { return state.isVisible; });
    var rootHeaders = useSelector(getRootHeaders);
    var className = "outliner-pane";
    if (!isVisible) {
        className = "outliner-pane-hide";
    }
    var style = {
        fontFamily: Settings.fontFamily,
        height: props.height,
    };
    return (React.createElement("div", { className: className, style: style },
        React.createElement("h1", null, "Outline"),
        React.createElement("ul", null, rootHeaders.map(function (h) { return React.createElement(OutlineItem, { header: h }); }))));
});

"use babel";

import { OutlineHeader, Inkdrop } from "./types";
import React from "react";

declare var inkdrop: Inkdrop;

interface IProps {
    header: OutlineHeader;
}

const jumpToLine = (lineNo: number) => {
    const editor = inkdrop.getActiveEditor();
    if (editor) {
        const coords = editor.cm.charCoords({line: lineNo, ch: 0}, "local").top;
        const offset = editor.cm.getScrollerElement().offsetHeight / 4;
        editor.cm.setCursor(lineNo, 0, {scroll: false});
        editor.cm.scrollTo(null, coords - offset);
    }
};

const OutlineItem = (props: IProps) => {
  return (
    <li>
      <a title={props.header.text} onClick={() => jumpToLine(props.header.line)}>{props.header.text}</a>
      {props.header.children.length > 0 &&
        <ul>
          {props.header.children.map(h => <OutlineItem header={h} />)}
        </ul>
      }
    </li>
  );
}

export default OutlineItem;
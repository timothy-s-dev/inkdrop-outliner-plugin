"use babel";

import * as React from "react";
import { useSelector } from 'react-redux';
import Settings from "./settings";
import { State } from "./store";
import { getRootHeaders } from "./selectors";
import OutlineItem from "./outline-item";
import { OutlineHeader } from "./types";

interface IProps {
    height: number;
}

export default (props: IProps) => {
  const isVisible = useSelector<State>(state => state.isVisible);
  const rootHeaders = useSelector<State, Array<OutlineHeader>>(getRootHeaders);

  let className = "outliner-pane";
  if (!isVisible) {
    className = "outliner-pane-hide";
  }

  const style = {
    fontFamily: Settings.fontFamily,
    height: props.height,
  };

  return (
    <div className={className} style={style}>
      <h1>Outline</h1>
      <ul>
        {rootHeaders.map(h => <OutlineItem header={h} />)}
      </ul>
    </div>
  );
}

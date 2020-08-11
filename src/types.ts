"use babel";
import CodeMirror from "codemirror";

export interface Inkdrop {
  window: any;
  commands: any;
  config: any;
  components: any;
  layouts: any;
  store: any;
  getActiveEditor(): Editor;
  onEditorLoad(callback: (e: Editor) => void): void;
}

export interface Editor {
  cm: CodeMirror.Editor;
  forceUpdate(): any;
}

export interface TextPosition {
  ch: number;
  line: number;
}

export interface TextChangedEvent {
  from: TextPosition;
  to: TextPosition;
  text: Array<string>;
  removed: Array<string>;
}

export interface OutlineHeader {
  text: string;
  parent?: OutlineHeader;
  children: Array<OutlineHeader>;
  level: number;
  line: number;
}
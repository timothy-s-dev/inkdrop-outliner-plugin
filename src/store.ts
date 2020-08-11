"use babel";

import { INITIALIZE, TOGGLE, LOAD_NOTE, UPDATE_NOTE } from './actions';
import { OutlineHeader } from './types';

export interface State {
  isVisible: boolean;
  allHeaders: Array<OutlineHeader>;
}

const initialState : State = {
  isVisible: false,
  allHeaders: [],
};

const headerRegex = /\s*#+\s+.+/g;
const hashRegex = /#+/g;

const getHeaderText = (headerText: string): string => {
  return headerText
    .trimStart()
    .replace(hashRegex, "")
    .trimStart();
}

const getHeaderLevel = (headerText: string): number => {
  const trimmed = headerText.trimStart();
  for(let i = 0; i < trimmed.length; ++i) {
    if(trimmed[i] != '#') {
      return i;
    }
  }
  return -1;
}

const getHeaderParent = (parentHeaders: Array<OutlineHeader>, level: number) => {
  for (let i = level - 1; i > 0; --i) {
    if (parentHeaders[i]) return parentHeaders[i];
  }
  return undefined;
}

const buildHeader = (text: string, lineNo: number): OutlineHeader => {
  return {
    text: getHeaderText(text),
    children: [],
    level: getHeaderLevel(text),
    line: lineNo
  };
}

const getAllHeadersFromNote = (noteText: Array<string>): Array<OutlineHeader> => {
  const headers: Array<OutlineHeader> = [];
  return noteText
    .map((text, lineNo) => { return { text, lineNo }; })
    .filter(line => line.text.match(headerRegex))
    .map(line => {
      const level = getHeaderLevel(line.text);
      const newHeader = buildHeader(line.text, line.lineNo);
      if(level > 1) {
        newHeader.parent = getHeaderParent(headers, level);
        if(newHeader.parent) {
          newHeader.parent.children.push(newHeader);
        }
      }
      headers[level] = newHeader;
      return newHeader;
    }).sort((a,b) => a.line - b.line);
}

const getUpdatedHeadersFromNote = (state: State, change: CodeMirror.EditorChange, newText: string): Array<OutlineHeader> => {
  const lineDelta = change.text.length - (1 + change.to.line - change.from.line);

  const preHeaders = state.allHeaders
    .filter(h => h.line < change.from.line)
    .map(h => { return { ...h, children: [], parent: undefined }});
  const newHeaders = newText.split('\n')
    .map((text, lineNo) => { return { text, lineNo: lineNo + change.from.line }; })
    .filter(line => line.text.match(headerRegex))
    .map(line => buildHeader(line.text, line.lineNo));
  const postHeaders = state.allHeaders
    .filter(h => h.line > change.to.line)
    .map(h => { return { ...h, line: h.line + lineDelta, children: [], parent: undefined }; });
  
  const allNewHeaders = [...preHeaders, ...newHeaders, ...postHeaders];
  
  // Re-calculate parentage
  const parentHeaders: Array<OutlineHeader> = [];
  for(let i = 0; i < allNewHeaders.length; ++i) {
    const header = allNewHeaders[i];
    header.parent = getHeaderParent(parentHeaders, header.level);
    if(header.parent) {
      header.parent.children.push(header);
    }
    parentHeaders[header.level] = header;
  }

  return allNewHeaders
}

export default (state: State = initialState, action: any) => {
  switch(action.type) {
    case INITIALIZE:
      return { ...state, allHeaders: getAllHeadersFromNote(action.noteText) };
    case TOGGLE:
      return { ...state, isVisible: !state.isVisible };
    case LOAD_NOTE:
      return { ...state, allHeaders: getAllHeadersFromNote(action.change.text) };
    case UPDATE_NOTE:
      return { ...state, allHeaders: getUpdatedHeadersFromNote(state, action.change, action.newText) };
  }
  return state;
}
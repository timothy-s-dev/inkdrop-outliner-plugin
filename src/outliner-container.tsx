"use babel";

import { useEffect } from "react";
import OutlinerPane from './outliner-pane';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {
  Inkdrop,
  Editor,
} from "./types";
import rootReducer from './store';
import { toggle, loadNote, updateNote, initialize } from "./actions";
import { CompositeDisposable } from 'event-kit';
import React from "react";

const store = createStore(rootReducer)

const $ = (query: string) => document.querySelector(query);

declare var inkdrop: Inkdrop;

const handleToggle = () => {
  store.dispatch(toggle());
}

const handleTextChange = (cm: CodeMirror.Editor, event: CodeMirror.EditorChange) => {
  if (event.origin === 'setValue') {
    store.dispatch(loadNote(event));
  } else {
    const lastLine = event.from.line + event.text.length;
    const newText = cm.getRange({ch: 0, line: event.from.line}, {ch: 0, line: lastLine});
    store.dispatch(updateNote(event, newText.substring(0, newText.length - 1)));
  }
};

const subscriptions = new CompositeDisposable();

const attatchEvents = (editor: Editor) => {
  store.dispatch(initialize(editor.cm.getValue().split('\n')));

  subscriptions.add(inkdrop.commands.add(document.body, {
    'outliner:toggle': handleToggle
  }));

  editor.cm.on("change", handleTextChange);
}

const dettatchEvents = (editor: Editor) => {
  subscriptions.dispose();

  editor.cm.off("change", handleTextChange);
}

const OutlinerContainer = () => {
  useEffect(() => {
    const editor = inkdrop.getActiveEditor();
    if (editor != null) {
      attatchEvents(editor);
    } else {
      inkdrop.onEditorLoad((e) => attatchEvents(e));
    }

    return () => {
      const editor = inkdrop.getActiveEditor();    
      // Handle case where note was deleted
      if (editor == null) {
        return;
      }
      dettatchEvents(editor);
    }
  });
  
  return (
    <Provider store={store}>
      <OutlinerPane height={inkdrop.window.getSize()[1]} />
    </Provider>
  );
};

export default OutlinerContainer;
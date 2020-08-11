"use babel";
import { useEffect } from "react";
import OutlinerPane from './outliner-pane';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './store';
import { toggle, loadNote, updateNote, initialize } from "./actions";
import { CompositeDisposable } from 'event-kit';
import React from "react";
var store = createStore(rootReducer);
var $ = function (query) { return document.querySelector(query); };
var handleToggle = function () {
    store.dispatch(toggle());
};
var handleTextChange = function (cm, event) {
    if (event.origin === 'setValue') {
        store.dispatch(loadNote(event));
    }
    else {
        var lastLine = event.from.line + event.text.length;
        var newText = cm.getRange({ ch: 0, line: event.from.line }, { ch: 0, line: lastLine });
        store.dispatch(updateNote(event, newText.substring(0, newText.length - 1)));
    }
};
var subscriptions = new CompositeDisposable();
var attatchEvents = function (editor) {
    store.dispatch(initialize(editor.cm.getValue().split('\n')));
    subscriptions.add(inkdrop.commands.add(document.body, {
        'outliner:toggle': handleToggle
    }));
    editor.cm.on("change", handleTextChange);
};
var dettatchEvents = function (editor) {
    subscriptions.dispose();
    editor.cm.off("change", handleTextChange);
};
var OutlinerContainer = function () {
    useEffect(function () {
        var editor = inkdrop.getActiveEditor();
        if (editor != null) {
            attatchEvents(editor);
        }
        else {
            inkdrop.onEditorLoad(function (e) { return attatchEvents(e); });
        }
        return function () {
            var editor = inkdrop.getActiveEditor();
            // Handle case where note was deleted
            if (editor == null) {
                return;
            }
            dettatchEvents(editor);
        };
    });
    return (React.createElement(Provider, { store: store },
        React.createElement(OutlinerPane, { height: inkdrop.window.getSize()[1] })));
};
export default OutlinerContainer;

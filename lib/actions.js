"use babel";
export var INITIALIZE = 'INITIALIZE';
export var TOGGLE = 'TOGGLE';
export var LOAD_NOTE = 'LOAD_NOTE';
export var UPDATE_NOTE = 'UPDATE_NOTE';
export var initialize = function (noteText) {
    return { type: INITIALIZE, noteText: noteText };
};
export var toggle = function () {
    return { type: TOGGLE };
};
export var loadNote = function (change) {
    return { type: LOAD_NOTE, change: change };
};
export var updateNote = function (change, newText) {
    return { type: UPDATE_NOTE, change: change, newText: newText };
};

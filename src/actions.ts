"use babel";

export const INITIALIZE = 'INITIALIZE';
export const TOGGLE = 'TOGGLE';
export const LOAD_NOTE = 'LOAD_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';

export const initialize = (noteText: Array<string>) => {
    return { type: INITIALIZE, noteText };
}

export const toggle = () => {
    return { type: TOGGLE };
};

export const loadNote = (change: CodeMirror.EditorChange) => {
    return { type: LOAD_NOTE, change };
};

export const updateNote = (change: CodeMirror.EditorChange, newText: string) => {
    return { type: UPDATE_NOTE, change, newText };
};
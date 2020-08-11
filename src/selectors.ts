"use babel";

import { State } from './store';
import { OutlineHeader } from './types';

export const getRootHeaders = (state: State): Array<OutlineHeader> => {
    const topLevel = state.allHeaders.reduce((prev, curr) => curr.level < prev ? curr.level : prev, 10)
    return state.allHeaders.filter(header => header.level === topLevel);
}
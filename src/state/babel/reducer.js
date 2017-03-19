// @flow

import * as t from "./actionTypes";
import {
  getPlugins,
  getPresets,
  getPresetNames,
  getContainingPresets,
  getPluginGroups,
  getVersion
} from "./selectors";

type State = {
  babel: Object,
  plugins: string[],
  presets: {[key: string]: string[]},
  containingPresets: {[key: string]: string[]},
  presetNames: string[],
  version: string,
  pluginGroups: {
    [key: string]: Array<{
      label: string,
      items: Array<{
        label: string, value: string
      }>
    }>
  }
}

const initialState: State = {
  babel: null,
  plugins: [],
  presets: {},
  containingPresets: {},
  presetNames: [],
  version: "not loaded",
  pluginGroups: {}
};

export default function babelReducer(state: State = initialState, action): State {
  // eslint-disable-next-line default-case
  switch (action.type) {
  case t.LOAD_STANDALONE:
    const { payload: babel } = action;
    state = {
      ...state,
      babel,
      plugins: getPlugins(babel),
      presets: getPresets(babel),
      containingPresets: getContainingPresets(babel),
      presetNames: getPresetNames(babel),
      version: getVersion(babel),
      pluginGroups: getPluginGroups(babel),
    };
    break;
  }
  return state;
}

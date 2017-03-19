// @flow

import * as t from "./actionTypes";

type State = {
  wrap: boolean,
  filter: string
}

const initialState: State = {
  wrap: true,
  filter: ""
};

export default function uiReducer(state: State = initialState, action): State {
  // eslint-disable-next-line default-case
  switch (action.type) {
  case t.SET_WRAP:
    state = {...state, wrap: action.payload};
    break;
  case t.SET_FILTER:
    state = {...state, filter: action.payload};
    break;
  }
  return state;
}

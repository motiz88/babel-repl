// @flow

import * as t from "./actionTypes";

type State = {
  evaluate: boolean,
  code: string
}

const initialState: State = {
  evaluate: true,
  code: `class X {
  foo: string = 'bar'
}`
};

export default function replReducer(state: State = initialState, action): State {
  // eslint-disable-next-line default-case
  switch (action.type) {
  case t.SET_CODE:
    state = {...state, code: action.payload};
    break;
  case t.SET_EVALUATE:
    state = {...state, evaluate: action.payload};
    break;
  }
  return state;
}

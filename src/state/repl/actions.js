// @flow

import { createAction } from "redux-actions";
import * as t from "./actionTypes";

export const setCode = createAction(t.SET_CODE);
export const setEvaluate = createAction(t.SET_EVALUATE);

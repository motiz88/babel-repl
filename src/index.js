// @flow

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import configureStore from "./state/configureStore";
import "./globalStyles";
import { Provider } from "react-redux";
import { loadStandalone } from "./state/babel/actions";

const store = configureStore();
const { Babel } = global;
store.dispatch(loadStandalone(Babel));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

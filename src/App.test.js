import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import configureStore from "./state/configureStore";
import { Provider } from "react-redux";

describe("App", () => {
  let div, store;

  beforeEach(() => {
    div = document.createElement("div");
    document.body.appendChild(div);
    store = configureStore();
  });

  it("renders without crashing", () => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      div
    );
  });

  afterEach(() => {
    document.body.removeChild(div);
  });
});

// @flow

import React from "react";
import Editor from "./Editor";
import OutputPane from "./OutputPane";
import transformer from "./transformer";
import evaluator from "./evaluator";
import Splitter from "react-splitter-layout";

let previous = { output: "", evaluated: "" };

const run = (input, { evaluate }) => {
  const result = transformer(input);

  if (result.code) {
    return previous = {
      output: result.code,
      evaluated: evaluate ? evaluator(result.code) : previous.evaluated,
      error: null,
    };
  } else {
    return {
      output: previous.output,
      evaluated: previous.evaluated,
      error: result.error,
    };
  }
};

const Repl = ({ code, onChange, presets, plugins, options, wrap, evaluate }: Props) => {
  const { output, evaluated, error } = run({ code, presets, plugins, options }, { evaluate });

  return (
    <div className="repl-main">
      <Splitter vertical={false} customClassName="xyz">
          <div className="repl-box repl-input">
              <Editor value={code} name="input-editor" onChange={onChange} wrap={wrap} />
              {error && <pre className="error output-box">{error}</pre>}
          </div>
          <div className="repl-box repl-output">
              <Editor value={output} name="output-editor" wrap={wrap} />
              {evaluated && <OutputPane value={evaluated} />}
          </div>
      </Splitter>
    </div>
  );
};

export default Repl;

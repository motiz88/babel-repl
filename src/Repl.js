// @flow

import React from "react";
import Editor from "./Editor";
import OutputPane from "./OutputPane";
import transformer from "./transformer";
import evaluator from "./evaluator";
import Splitter from "react-splitter-layout";
import { connect } from "react-redux";
import styled from "styled-components";

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

const Container = styled.div `
  flex: 1;
  display: flex;
  position: relative;
`;

const Column = styled.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: stretch;

  textarea {
    flex: 1;
    outline: none;
    border: 1px solid #f1f1f1;
  }
`;

const ErrorBox = styled.pre `
  color: #c7254e;
  font-size: 10px;
  margin: 0;
  padding: .5em;
  background: #f1f1f1;
`;

const Repl = ({ Babel, code, onChange, presets, plugins, options, wrap, evaluate }: Props) => {
  const { output, evaluated, error } = run({ Babel, code, presets, plugins, options }, { evaluate });

  return (
    <Container>
      <Splitter vertical={false}>
          <Column>
              <Editor value={code} name="input-editor" onChange={onChange} wrap={wrap} />
              {error && <ErrorBox>{error}</ErrorBox>}
          </Column>
          <Column>
              <Editor value={output} name="output-editor" wrap={wrap} />
              {evaluated && <OutputPane value={evaluated} />}
          </Column>
      </Splitter>
    </Container>
  );
};

export default connect(
  (state) => ({Babel: state.babel.babel})
)(Repl);

// @flow

import React from "react";
import { Value } from "react-object";
import styled from "styled-components";

const Error = styled.pre `
  color: #c7254e;
`;

const OutputError = ({value: error}) => {
  return (
    <Error>
      {error.stack || error.message || String(error)}
    </Error>
  );
};

const OutputValue = ({value}) => {
  if (value && value instanceof Error) {
    return <OutputError value={value} />;
  }
  return <Value value={value} inline={true} marginRight={10} />;
};

const OutputLine = ({type, values}) => {
  return (
    <div>
      {values.map((value, i) => <OutputValue value={value} key={i} />)}
    </div>
  );
};

const Container = styled.div `
  font-size: 10px;
  margin: 0;
  padding: .5em;
  background: #f1f1f1;
`;

const OutputPane = ({value: lines}) => {
  return (
    <Container>
      {lines.map((line, i) => <OutputLine {...line} key={i} /> )}
    </Container>
  );
};

export default OutputPane;

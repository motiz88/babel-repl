// @flow

import React from "react";
import { Value } from "react-object";

const OutputError = ({value: error}) => {
  return (
    <pre className="error">
      {error.stack || error.message || String(error)}
    </pre>
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

const OutputPane = ({value: lines}) => {
  return (
    <div className="evaluated output-box">
      {lines.map((line, i) => <OutputLine {...line} key={i} /> )}
    </div>
  );
};

export default OutputPane;

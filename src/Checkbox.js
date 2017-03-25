import React from "react";
import styled from "styled-components";

const Checkbox = ({type, ...props}) => <input type="checkbox" {...props} />;

export default styled(Checkbox)`
  margin-right: 0.2em;
`;

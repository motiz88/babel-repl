import { injectGlobal } from "styled-components";

// eslint-disable-next-line no-unused-expressions
injectGlobal`
    * {
      box-sizing: border-box;
    }

    body {
      height: 100%;
      width: 100%;
      overflow: hidden;
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }

    h3 {
      font-size: 14px;
    }

    h4 {
      font-size: 13px;
    }

    h3,
    h4 {
      margin-top: .5em;
      margin-bottom: .5em;
    }
`;

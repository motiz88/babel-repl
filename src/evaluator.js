// @flow

const evaluate = (code: string): Array => {
  const capturingConsole = Object.create(console);
  let buffer = [];
  let done = false;

  const flush = () => {
		// $dom.text(buffer.join('\n')) // ...
		// TODO: this just updated the DOM, and it's useful for async logs...
  };
  const write = (line) => {
    buffer.push(line);
    if (done) {
      flush();
    }
  };

  const capture = (key, ...args) => {
    write({type: key, values: args});
  };

  capturingConsole.clear = () => {
    buffer = [];
    flush();
    console.clear();
  };

  ["error", "log", "info", "debug"].forEach((key) => {
    capturingConsole[key] = (...args) => {
      console[key](...args);
      capture(key, ...args);
    };
  });

  try {
    new Function("console", code)(capturingConsole); // eslint-disable-line no-new-func
  } catch (err) {
    buffer.push({type: "error", values: [err]});
  }

  done = true;

  return buffer;
};

export default evaluate;

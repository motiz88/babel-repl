// @flow

import mergeOptions from "./mergeOptions";

type Input = {
  code: string,
  plugins: string[],
  presets: string[],
  options: {
    [pluginOrPreset: string]: {
      [option: string]: mixed,
    },
  },
  Babel: Object
}

type Output = { code: string } | { error: string }

const processOptions = ({ plugins, presets, options }) => ({
  presets: mergeOptions(presets, options),
  plugins: mergeOptions(plugins, options)
});

const transformer = ({ Babel, code, ...rest }: Input): Output => {
  try {
    return {
      code: Babel.transform(code, processOptions(rest)).code
    };
  } catch (e) {
    return {
      error: e.message
    };
  }
};

export default transformer;

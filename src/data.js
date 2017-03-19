// @flow

const { Babel } = window;

export const PLUGINS = Object.keys(Babel.availablePlugins);
export const PRESETS = {};

for (const key of Object.keys(Babel.availablePresets)) {
  const preset = Babel.availablePresets[key];
  PRESETS[key] = getPresetPlugins(preset);
}

export const CONTAINING_PRESETS = {
  "stage-0": ["stage-1", "stage-2", "stage-3"],
  "stage-1": ["stage-2", "stage-3"],
  "stage-2": ["stage-3"],
  "latest": ["es2015", "es2016", "es2017"],
};

export const PRESET_NAMES = Object.keys(PRESETS);

export const VERSION = Babel.version;

function getPluginName (plugin) {
  if (typeof plugin === "string") {
    return plugin;
  }
  if (Array.isArray(plugin)) {
    return getPluginName(plugin[0]);
  }
  return PLUGINS.find((name) => Babel.availablePlugins[name] ===  plugin);
}

function getPresetPlugins (preset) {
  if (Array.isArray(preset.plugins)) {
    return preset.plugins.map(getPluginName);
  } else if (typeof preset === "function") {
    return getPresetPlugins(preset());
  }
  return [];
}

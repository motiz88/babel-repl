// @flow

const { Babel } = window;

export const PLUGINS = getPlugins(Babel);
export const PRESETS = getPresets(Babel);
export const CONTAINING_PRESETS = getContainingPresets(Babel);
export const PRESET_NAMES = Object.keys(PRESETS);
export const VERSION = Babel.version;

function getPlugins (Babel) {
  return Object.keys(Babel.availablePlugins);
}

function getPluginName (Babel, plugin) {
  const { availablePlugins } = Babel;
  if (typeof plugin === "string") {
    return plugin;
  }
  if (Array.isArray(plugin)) {
    return getPluginName(Babel, plugin[0]);
  }
  return PLUGINS.find((name) => availablePlugins[name] ===  plugin);
}

function getPresetPlugins (Babel, preset) {
  if (Array.isArray(preset.plugins)) {
    return preset.plugins.map(plugin => getPluginName(Babel, plugin));
  } else if (typeof preset === "function") {
    return getPresetPlugins(Babel, preset());
  }
  return [];
}

function getPresets (Babel) {
  const { availablePresets } = Babel;
  const PRESETS = {};
  for (const key of Object.keys(availablePresets)) {
    const preset = availablePresets[key];
    PRESETS[key] = getPresetPlugins(Babel, preset);
  }
  return PRESETS;
}

function getContainingPresets (Babel) {
  const { availablePresets } = Babel;
  const presetInverseMap = new Map();
  for (const key of Object.keys(availablePresets)) {
    const preset = availablePresets[key];
    presetInverseMap.set(key, key);
    presetInverseMap.set(preset, key);
    if (preset.buildPreset) {
      presetInverseMap.set(String(preset.buildPreset), key);
    }
  }
  const getContainedPresets = (preset, cache) => {
    if (!cache) {
      cache = new Map();
    }
    if (cache.has(preset)) {
      return cache.get(preset);
    }
    if (typeof preset === 'function') {
      preset = preset();
    }
    if (!preset || typeof preset !== 'object' || !preset.presets) {
      return [];
    }
    const result = [];
    for (const base of preset.presets) {
      const basePreset = Array.isArray(base) ? base[0] : base;
      const key = presetInverseMap.get(basePreset) || presetInverseMap.get(String(basePreset));
      if (!key) {
        continue;
      }
      result.push(key);
      result.push(...getContainedPresets(basePreset, cache));
    }
    cache.set(preset, result);
    return result;
  };
  const CONTAINING_PRESETS = {};
  for (const key of Object.keys(availablePresets)) {
    const preset = availablePresets[key];
    const contained = getContainedPresets(preset);
    if (contained.length) {
      CONTAINING_PRESETS[key] = contained;
    }
  }
  return CONTAINING_PRESETS;
}

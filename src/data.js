// @flow

const { Babel } = window;

export const PLUGINS = Object.keys(Babel.availablePlugins);
export const PRESETS = {};

for (const key of Object.keys(Babel.availablePresets)) {
  const preset = Babel.availablePresets[key];
  PRESETS[key] = getPresetPlugins(preset);
}


export const CONTAINING_PRESETS = getContainingPresets(Babel);
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

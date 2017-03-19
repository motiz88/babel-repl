// @flow

import { createSelector } from "reselect";

export const getPlugins = createSelector(
  (babel) => babel.availablePlugins,
  (availablePlugins) => Object.keys(availablePlugins)
);


function getPluginName (babel, plugin) {
  const plugins = getPlugins(babel);
  const { availablePlugins } = babel;
  if (typeof plugin === "string") {
    return plugin;
  }
  if (Array.isArray(plugin)) {
    return getPluginName(babel, plugin[0]);
  }
  return plugins.find((name) => availablePlugins[name] ===  plugin);
}

function getPresetPlugins (babel, preset) {
  if (Array.isArray(preset.plugins)) {
    return preset.plugins.map((plugin) => getPluginName(babel, plugin));
  } else if (typeof preset === "function") {
    return getPresetPlugins(babel, preset());
  }
  return [];
}

export const getPresets = (babel) => {
  const { availablePresets } = babel;
  const presets = {};
  for (const key of Object.keys(availablePresets)) {
    const preset = availablePresets[key];
    presets[key] = getPresetPlugins(babel, preset);
  }
  return presets;
};


export const getContainingPresets = createSelector((babel) => babel.availablePresets,
  (availablePresets) => {
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
      if (typeof preset === "function") {
        preset = preset();
      }
      if (!preset || typeof preset !== "object" || !preset.presets) {
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
    const containingPresets = {};
    for (const key of Object.keys(availablePresets)) {
      const preset = availablePresets[key];
      const contained = getContainedPresets(preset);
      if (contained.length) {
        containingPresets[key] = contained;
      }
    }
    return containingPresets;
  }
);

export const getPluginGroups = createSelector(
  getPlugins,
  (plugins) => {
    const groupNames = ["transform-es2015", "transform-react", "transform", "syntax"];
    plugins = [...plugins];
    const groups = {};
    for (const group of groupNames) {
      const groupPlugins = plugins.filter((plugin) => plugin.startsWith(group + "-"));
      groups[group] = {
        label: group,
        items: groupPlugins.map((plugin) => ({value: plugin, label: plugin.substring((group + "-").length)}))
      };
      plugins = plugins.filter((plugin) => !plugin.startsWith(group + "-"));
    }
    groups["misc"] = {
      label: "Misc",
      items: plugins
    };
    return groups;
  }
);

export const getVersion = (babel) => babel.version;

export const getPresetNames = createSelector(getPresets, (presets) => Object.keys(presets));

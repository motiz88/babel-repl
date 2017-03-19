// @flow

import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import SelectableList from "./SelectableList";
import GroupedSelectableList from "./GroupedSelectableList";
import Repl from "./Repl";
import persistence from "./persistence";
import mergeOptions from "./mergeOptions";
import _ from "lodash";
import "./App.css";
import { connect } from "react-redux";
import { setCode, setEvaluate } from "./state/repl/actions";
import { setWrap, setFilter } from "./state/ui/actions";

class App extends Component {
  state = {
    presets: {},
    plugins: {},
    options: {}
  }

  render() {
    const presets = this.selectedPresets();
    const plugins = this.selectedPlugins();
    const { code, wrap, evaluate, setCode, filter, version } = this.props;
    const { options } = this.state;

    return (
      <DocumentTitle title={`Babel ${version} REPL`}>
        <div className="repl">
          {this.state.showConfig && (
            <dialog open={true} className="dialog">
              <button onClick={this.hideConfig}>Close</button>
              <pre>{this.generateConfig()}</pre>
            </dialog>
          )}
          <div className="repl-top-bar">
            <ul className="repl-top-options">
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={evaluate}
                    onChange={this.handleEvaluateChanged}
                  />
                  Evaluate
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={wrap}
                    onChange={this.handleWrapChanged}
                  />
                  Line Wrap
                </label>
              </li>
            </ul>
            <h3>Babel {version}</h3>
          </div>
          <div className="repl-horiz">
            <div className="repl-options">
              <button onClick={this.showConfig}>Gen</button>
              <input
                type="text"
                value={filter}
                onChange={this.handleFilterChanged}
                className="filter-input"
                placeholder="Filter..."
                onKeyUp={this.handleFilterKeyUp}
              />
              <h3>Presets</h3>
              <SelectableList
                items={this.props.presetNames}
                selected={this.state.presets}
                disabled={presets.reduce((carry, curr) => (
                  [ ...carry, ...(this.props.containingPresets[curr] || []) ]
                ), [])}
                onItemToggle={this.togglePreset}
                options={options}
                onOptionToggle={this.togglePresetOption}
                onOptionChange={this.handlePresetOptionChanged}
                filter={filter}
              />

              <h3>Plugins</h3>
              <GroupedSelectableList
                groups={this.props.pluginGroups}
                selected={this.state.plugins}
                disabled={presets.reduce((carry, curr) => (
                  [ ...carry, ...this.props.presets[curr] ]
                ), [])}
                onItemToggle={this.togglePlugin}
                options={options}
                filter={filter}
              />
            </div>

            <Repl
              code={code}
              presets={presets}
              plugins={plugins}
              options={options}
              evaluate={evaluate}
              wrap={wrap}
              onChange={setCode}
            />
          </div>
        </div>
      </DocumentTitle>
    );
  }

  selectedPresets() {
    return this.selected("presets");
  }

  selectedPlugins() {
    return this.selected("plugins");
  }

  selected(key) {
    return Object.keys(this.state[key]).filter((k) => this.state[key][k]);
  }

  xcomponentWillMount() {
    this.setState(persistence.load());
  }

  xcomponentDidUpdate() {
    persistence.save({
      code: this.props.code,
      presets: this.presets,
      babili: false, // TODO
      lineWrap: false, // TODO
      evaluate: false, // TODO
    });
  }

  updatePresetOption = (preset, changes) => {
    this.setState({
      options: {
        ...this.state.options,
        [preset]: {
          ...this.state.options[preset],
          ...changes,
        }
      }
    });
  }

  togglePresetOption = (preset) => {
    this.updatePresetOption(preset, {
      enabled: this.state.options[preset] ? !this.state.options[preset].enabled : true,
    });
  }

  handlePresetOptionChanged = (preset, opts) => {
    this.updatePresetOption(preset, {
      value: opts,
    });
  }

  togglePreset = (preset) => {
    this.setState((state) => ({
      presets: _.omit({
        ...state.presets,
        [preset]: !state.presets[preset],
      }, this.props.containingPresets[preset]),
      plugins: _.omit(state.plugins, this.props.presets[preset]),
    }));
  }

  togglePlugin = (plugin) => {
    this.setState((state) => ({
      plugins: {
        ...state.plugins,
        [plugin]: !state.plugins[plugin],
      },
    }));
  }

  showConfig = () => this.setState({ showConfig: true })
  hideConfig = () => this.setState({ showConfig: false })

  generateConfig() {
    const config = {};

    const presets = Object.keys(this.state.presets).filter((k) => this.state.presets[k]);
    const plugins = Object.keys(this.state.plugins).filter((k) => this.state.plugins[k]);
    const { options } = this.state;

    if (presets.length) {
      config.presets = mergeOptions(presets, options);
    }

    if (plugins.length) {
      config.plugins = mergeOptions(plugins, options);
    }

    return JSON.stringify(config, null, 2);
  }

  handleEvaluateChanged = (event) => {
    this.props.setEvaluate( event.target.checked );
  }

  handleWrapChanged = (event) => {
    this.props.setWrap( event.target.checked );
  }

  handleFilterChanged = (event) => {
    this.props.setFilter( event.target.value );
  }

  handleFilterKeyUp = (event) => {
    if (event.keyCode === 27 /* esc */) {
      this.props.setFilter("");
    }
  }
}

export default connect((state) => ({
  filter: state.ui.filter,
  wrap: state.ui.wrap,
  evaluate: state.repl.evaluate,
  code: state.repl.code,
  plugins: state.babel.plugins,
  presets: state.babel.presets,
  containingPresets: state.babel.containingPresets,
  presetNames: state.babel.presetNames,
  version: state.babel.version,
  pluginGroups: state.babel.pluginGroups
}), {
  setWrap,
  setCode,
  setEvaluate,
  setFilter
})(App);

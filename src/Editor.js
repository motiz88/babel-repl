// @flow

import React from "react";
import ReactAce from "react-ace";
import "brace/mode/javascript";
import "brace/theme/tomorrow";
import SizeMe from "react-sizeme";

type Props = {
  name: string,
  value: string,
  onChange?: (value: string) => any,
  wrap: boolean
}

class Editor extends React.Component<Props> {
  static defaultProps = {
    size: {
      width: 0,
      height: 0
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.size.width !== this.props.size.width || prevProps.size.height !== this.props.size.height) {
      if (this.ace) {
        this.ace.editor.resize();
      }
    }
  }

  render() {
    const { name, value, onChange, wrap } = this.props;
    return (
      <div className="editor-wrapper">
        <ReactAce
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
          ref={(instance) => { this.ace = instance; }}
          onChange={onChange}
          value={value}
          name={name}
          readOnly={!onChange}
          height='100%'
          width='100%'
          mode="javascript"
          theme="tomorrow"
          tabSize={2}
          showPrintMargin={false}
          setOptions={{
            useSoftTabs: true,
            useWorker: false
          }}
          wrapEnabled={wrap}
        />
      </div>
    );
  }
}


export default SizeMe({ monitorHeight: true, monitorWidth: true })(Editor);

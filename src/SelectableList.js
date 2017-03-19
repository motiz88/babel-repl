// @flow

import React from "react";
import { match } from "./filterUtils";

type Props = {
  items: string[],
  selected: { [option: string]: boolean },
  disabled: string[],
  onItemToggle: (option: string) => any,
}

const normaliseItem = (item) => {
  const value = typeof item === "string" ? item : item.value;
  const label = typeof item === "string" ? item : item.label;
  return { value, label };
};

const itemMatchesFilter = (item, filter) => {
  const { value, label } = normaliseItem(item);
  return match(value, filter) || match(label, filter);
};

export { itemMatchesFilter };

const OptionsList = ({ item, options, onOptionToggle, onOptionChange }) => {
  const { value } = normaliseItem(item);

  const enabled = options ? options.enabled : false;

  return (
    <div style={{ display: "inline" }}>
      <input type="checkbox" checked={enabled} onChange={() => onOptionToggle(value)} />
      {enabled && (
        <textarea
          defaultValue={options.value ? JSON.stringify(options.value) : ""}
          onBlur={(e) => onOptionChange(value, JSON.parse(e.target.value))}
        />
      )}
    </div>
  );
};

const ListItem = ({ disabled, selected, onClick, item, options, onOptionToggle, onOptionChange }) => {
  const { value, label } = normaliseItem(item);
  return disabled ? (
    <li>
			<input type="checkbox" checked disabled />
			<label>{label}</label>
    </li>
  ) : (
    <li>
      <input type="checkbox" checked={selected} onChange={() => onClick(value)} />
      <label onClick={() => onClick(value)}>{label}</label>
      {selected && (
        <OptionsList
          item={item}
          options={options[value]}
          onOptionToggle={onOptionToggle}
          onOptionChange={onOptionChange}
        />
      )}
    </li>
  );
};

const SelectableList = ({
  items,
  selected,
  disabled = [],
  onItemToggle,
  options,
  onOptionToggle,
  onOptionChange,
  filter
}: Props) => (
	<ul>
		{items.map((opt) => {
  const { value } = normaliseItem(opt);
  if (filter && !itemMatchesFilter(opt, filter)) {
    return null;
  }
  return (
        <ListItem
          key={value}
          item={opt}
          disabled={disabled.includes(value)}
          selected={selected[value] || false}
          onClick={onItemToggle}
          options={options}
          onOptionToggle={onOptionToggle}
          onOptionChange={onOptionChange}
        />
  );}
    )}
	</ul>
);

export default SelectableList;

// @flow

import React from "react";
import { match } from "./filterUtils";
import Checkbox from "./Checkbox";
import styled from "styled-components";

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
      <Checkbox checked={enabled} onChange={() => onOptionToggle(value)} />
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
			<Checkbox checked disabled />
			<label>{label}</label>
    </li>
  ) : (
    <li>
      <Checkbox checked={selected} onChange={() => onClick(value)} />
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

const List = styled.ul `
  padding: 0;
  list-style: none;
  margin-top: .5em;
  margin-bottom: .5em;
`;

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
	<List>
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
	</List>
);

export default SelectableList;

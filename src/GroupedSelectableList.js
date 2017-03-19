import SelectableList, { itemMatchesFilter } from "./SelectableList";
import React from "react";
import { match } from "./filterUtils";

const normaliseGroup = (key, group) => {
  if (Array.isArray(group)) {
    return { label: key, items: group };
  }
  return group;
};
const GroupedSelectableList = ({
  groups,
  selected,
  disabled = [],
  onItemToggle,
  options,
  onOptionToggle,
  onOptionChange,
  filter
}: Props) => (
  <div>
    {Object.keys(groups).map((key) => {
      const { label, items } = normaliseGroup(key, groups[key]);
      const groupMatchesFilter = match(label, filter);
      const itemsMatchFilter = filter && items.some((item) => itemMatchesFilter(item, filter));
      if (filter && !groupMatchesFilter && !itemsMatchFilter) {
        return null;
      }
      return (
        <div key={key}>
          <h4>{label}</h4>
          <SelectableList
            items={items}
            selected={selected}
            disabled={disabled}
            onItemToggle={onItemToggle}
            options={options}
            onOptionToggle={onOptionToggle}
            onOptionChange={onOptionChange}
            filter={(filter && groupMatchesFilter) ? null : filter}
        />
        </div>
      );
    })}
  </div>

);

export default GroupedSelectableList;

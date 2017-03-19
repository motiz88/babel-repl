export const normalise = (str) => {
  if (!str) {
    return str;
  }
  return str.replace(/[\-\s]+/g, " ").trim().toLowerCase();
};

export const match = (value, filter) => {
  return value && filter && (normalise(value).indexOf(normalise(filter)) !== -1);
};

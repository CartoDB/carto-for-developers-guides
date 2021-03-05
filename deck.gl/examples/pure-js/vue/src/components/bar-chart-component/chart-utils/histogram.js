export function groupValuesByColumn(data, valuesColumn, keysColumn) {
  if (Array.isArray(data) && data.length === 0) {
    return [{category: '', value: 0}];
  }
  
  const groups = data.reduce((accumulator, item) => {
    const group = item.properties[keysColumn];
  
    accumulator[group] = accumulator[group] || [];
  
    const isValid = item.properties[valuesColumn] !== null && item.properties[valuesColumn] !== undefined;
  
    if (isValid) {
      accumulator[group].push(item.properties[valuesColumn]);
    }
  
    return accumulator;
  }, {});
  
  return Object.entries(groups).map(([category, value]) => ({
    category,
    value: sum(value)
  }));
}
  
const sum = (values, key) => {
  const fn = key ? (a, b) => a + b[key] : (a, b) => a + b;
  return values.reduce(fn, 0);
};
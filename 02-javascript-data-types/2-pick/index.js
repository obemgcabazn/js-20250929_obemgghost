/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const objArr = Object.entries(obj);
  return Object.fromEntries(objArr.filter((key) => fields.includes(key[0])));
};

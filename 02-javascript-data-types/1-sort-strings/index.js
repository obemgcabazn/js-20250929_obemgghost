/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const collator = new Intl.Collator('ru', { caseFirst: 'upper' });
  const newArr = [...arr];
  if (param === 'asc') {
    return newArr.sort(collator.compare);
  } else {
    return newArr.sort((a, b) => collator.compare(b, a));
  }
}

/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let result = '';
  let currentCount = 0;
  let previousChar = null;

  switch (size) {
  case undefined:
    return string;
  case null:
    return '';
  case 0:
    return '';
  }

  for (const char of string) {
    if (char !== previousChar) {
      currentCount = 1;
      result += char;
    } else {
      currentCount++;
      if (currentCount <= size) {
        result += char;
      }
    }
    previousChar = char;
  }
  return result;
}

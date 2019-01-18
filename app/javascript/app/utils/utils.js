import deburr from 'lodash/deburr';
import upperFirst from 'lodash/upperFirst';

export const lowerDeburr = string => deburr(string.toLowerCase());
export const upperDeburr = string => deburr(String(string).toUpperCase());
export const upperCaseLabels = options =>
  options.map(o => ({ ...o, label: upperFirst(o.label) }));

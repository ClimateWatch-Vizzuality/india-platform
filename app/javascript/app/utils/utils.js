import upperFirst from 'lodash/upperFirst';

export const upperCaseLabels = options =>
  options.map(o => ({ ...o, label: upperFirst(o.label) }));

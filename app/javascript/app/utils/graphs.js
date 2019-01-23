import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

export const CHART_COLORS = [
  '#00B4D2',
  '#0677B3',
  '#D2187C',
  '#FFB400',
  '#FF7800',
  '#FF88AA',
  '#AB0000',
  '#20D5B7',
  '#383F45',
  '#CACCD0',
  '#80DAE9',
  '#93BBD9',
  '#E98CBE',
  '#FFDA80',
  '#FFBC80',
  '#FFC4D5',
  '#D58080',
  '#90EADB',
  '#9C9FA2',
  '#E5E6E8'
];

export const getTooltipConfig = columns => {
  const tooltip = {};
  (columns || []).forEach(column => {
    tooltip[column.value] = { label: column.label };
  });
  return tooltip;
};

export const getThemeConfig = (
  columns,
  colorCache = {},
  colors = CHART_COLORS
) =>
  {
    const theme = {};
    let newColumns = columns;
    let usedColors = [];
    if (colorCache && !isEmpty(colorCache)) {
      const usedColumns = columns.filter(c => colorCache[c.value]);
      usedColors = uniq(usedColumns.map(c => colorCache[c.value].stroke));
      newColumns = columns.filter(c => !usedColumns.includes(c.value));
    }
    const themeUsedColors = [];
    let availableColors = colors.filter(c => !usedColors.includes(c));
    newColumns.forEach((column, i) => {
      availableColors = availableColors.filter(
        c => !themeUsedColors.includes(c)
      );
      if (!availableColors.length) availableColors = colors;
      let index;
      if (column.index || column.index === 0) {
        index = { column };
      } else {
        index = i % availableColors.length;
        themeUsedColors.push(selectedColor);
      }
      const selectedColor = availableColors[index];
      theme[column.value] = { stroke: selectedColor, fill: selectedColor };
    });
    return { ...theme, ...colorCache };
  };

export const getColumnValue = column => upperFirst(camelCase(column));
export const getYColumnValue = column => `y${getColumnValue(column)}`;

function setBuffer(min) {
  if (min <= 0.1) return min;
  return min * 0.7;
}

export function setYAxisDomain() {
  return [ setBuffer, 'auto' ];
}

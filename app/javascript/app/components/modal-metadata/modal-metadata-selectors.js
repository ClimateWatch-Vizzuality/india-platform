import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const getData = state => state.data || null;
const getActive = state => state.active || null;
const getTitle = state => state.customTitle || '';

export const getModalData = createSelector([ getData, getActive ], (
  data,
  active
) =>
  {
    if (isEmpty(data) || !active || !active.length) return null;
    const dataKeys = Object.keys(data);
    if (isEmpty(dataKeys)) return null;
    const keys = Object.keys(data[dataKeys[0]]);
    const metadataEmptyObject = keys.reduce(
      (acc, k) => ({ ...acc, [k]: null }),
      {}
    );
    return active.map(
      s => data[s] || { ...metadataEmptyObject, short_title: s }
    );
  });

export const getModalTitle = createSelector([ getTitle, getModalData ], (
  customTitle,
  data
) =>
  {
    if (!data || isEmpty(data)) return null;
    return data.length > 1 ? customTitle : data[0].title;
  });

export const getTabTitles = createSelector(
  getModalData,
  data => data && data.length > 1 ? data.map(d => d.short_title) : null
);

export default { getModalTitle, getModalData, getTabTitles };

import { useState, useCallback } from 'react';
import {
  first,
  flow,
  isUndefined,
  map,
  prop,
  reject,
} from 'lodash/fp';

export default ({
  fields,
  filters,
}) => {
  const defaultQueryField = flow(first, prop('key'))(fields);
  const defaultFilterValues = flow(
    reject(flow(prop('defaultValue'), isUndefined)),
    map(({ defaultValue, dataKey }) => ({
      dataKey,
      value: defaultValue,
    })),
  )(filters);
  const [dates, setDates] = useState([]);
  const [queryField, setQueryField] = useState(defaultQueryField);
  const [queryValue, setQueryValue] = useState('');
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const openCreateModal = useCallback(() => setCreateModalVisible(true), []);
  const closeCreateModal = useCallback(() => setCreateModalVisible(false), []);
  const openEditModal = useCallback((item) => {
    setEditModalVisible(true);
    setEditItem(item);
  }, []);
  const closeEditModal = useCallback(() => {
    setEditModalVisible(false);
    setEditItem(null);
  }, []);
  const reset = useCallback(async () => {
    setDates([]);
    setQueryField(defaultQueryField);
    setQueryValue('');
    setFilterValues(defaultFilterValues);
    setCreateModalVisible(false);
    setEditModalVisible(false);
    setEditItem(null);
  }, [
    defaultQueryField,
    defaultFilterValues,
  ]);

  return {
    dates,
    setDates,
    queryField,
    setQueryField,
    queryValue,
    setQueryValue,
    filterValues,
    setFilterValues,
    createModalVisible,
    editModalVisible,
    editItem,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    reset,
  };
};

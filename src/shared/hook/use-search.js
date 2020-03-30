import React, { useCallback } from 'react';
import {
  concat,
  every,
  filter,
  find,
  flow,
  includes,
  isFunction,
  isNil,
  map,
  prop,
  propEq,
  reject,
  toUpper,
} from 'lodash/fp';
import { Message } from 'antd';
import TableHeader from 'shared/components/table-header';
import useBasicSearch from './use-basic-search';

// {
//   query: {
//     fields: [{ key, text }],
//     onValueChange: func,
//     onFieldChange: func,
//     width: number,
//     placeholder: string,
//   },
//   filters: [{
//     dataKey: string,
//     label: string,
//     options: [{ text: string, value: string }],
//     defaultValue: value,
//     dropdownMatchSelectWidth: bool,
//     onFilterChange: func,
//     disabled: bool,
//   }],
//   createLink: { text: string, link: string },
//   datePickers: [{
//     dataKey: string,
//     label: string,
//     onDateChange: func,
//     disabledDate: func,
//   }],
//   createModal: {
//     title: string,
//     initialValues: object,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//   },
//   editModal: {
//     title: string,
//     initialValues: object,
//     onSubmit: func,
//     fields: array,
//     layout: object,
//     getFields: func,
//   },
// })

export default ({
  query: { onFieldChange, onValueChange, fields, width } = {},
  filters = [],
  createLink,
  datePickers,
  createModal: { onSubmit: createSubmit } = {},
  createModal,
  editModal: { onSubmit: editSubmit } = {},
  editModal,
}) => {
  const {
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
  } = useBasicSearch({ fields, filters });

  const onQueryFieldChange = useCallback((fieldKey) => {
    if (isFunction(onFieldChange)) {
      onFieldChange(fieldKey);
    }
    if (isFunction(onValueChange)) {
      onValueChange('');
    }
    setQueryField(fieldKey);
    setQueryValue('');
  }, [
    onFieldChange,
    onValueChange,
  ]);
  const onQueryValueChange = useCallback(({ target: { value } }) => {
    if (isFunction(onValueChange)) {
      onValueChange(value);
    }
    setQueryValue(value);
  }, [
    onValueChange,
  ]);
  const onFilterValueChange = useCallback((value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onFilterChange'))(filters);
    if (isFunction(onChange)) {
      onChange(value);
    }
    setFilterValues(flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(filters));
  }, [
    filters,
  ]);
  const onDateChange = useCallback((value, dataKey) => {
    const onChange = flow(find(propEq('dataKey', dataKey)), prop('onDateChange'))(datePickers);
    if (isFunction(onChange)) {
      onChange(value);
    }
    setDates(flow(
      reject(propEq('dataKey')(dataKey)),
      concat({
        dataKey,
        value,
      }),
    )(dates));
  }, [
    datePickers,
    dates,
  ]);
  const onCreateSubmit = useCallback(async (values) => {
    await createSubmit(values);
    closeCreateModal();
    Message.success('创建成功');
  }, [
    createSubmit,
  ]);
  const onEditSubmit = useCallback(async (values) => {
    await editSubmit({ ...values, id: editItem.id }, values, editItem);
    closeEditModal();
    Message.success('编辑成功');
  }, [
    editSubmit,
    editItem,
  ]);
  const getDataSource = useCallback(filter(
    (item) => {
      let queryResult = true;
      if (queryValue && queryField) {
        queryResult = flow(
          prop(queryField),
          toUpper,
          includes(toUpper(queryValue)),
        )(item);
      }

      let filterResult = true;
      if (filters.length > 0) {
        filterResult = every(({ dataKey, value }) => value === '' || isNil(value) || propEq(dataKey, value)(item))(filters);
      }

      let datesResult = true;
      if (dates.length > 0) {
        datesResult = every(({ dataKey, value }) => {
          if (value && value.length > 1) {
            const selectedDate = prop(dataKey)(item);
            const [startDate, endDate] = value;
            return startDate.isBefore(selectedDate) && endDate.isAfter(selectedDate);
          }
          return true;
        })(dates);
      }

      return filterResult && queryResult && datesResult;
    },
  ), [
    queryValue,
    queryField,
    filters,
    dates,
  ]);

  return {
    getDataSource,
    filterValues,
    openEditModal,
    reset,
    pagination: {
      showTotal: (total) => `总数 ${total}`,
    },
    tableHeader: <TableHeader
      query={{
        onFieldChange: onQueryFieldChange,
        onValueChange: onQueryValueChange,
        value: queryValue,
        field: queryField,
        fields,
        width,
      }}
      createLink={createLink}
      filter={{
        items: map(({
          dataKey,
          ...others
        }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(filters),
          ...others,
        }))(filters),
        onSelect: onFilterValueChange,
      }}
      editModal={editModal && {
        ...editModal,
        initialValues: editItem,
        fields: editModal.getFields ? editModal.getFields(editItem) : editModal.fields,
      }}
      createModal={createModal}
      onCreateSubmit={onCreateSubmit}
      onEditSubmit={onEditSubmit}
      createModalVisible={createModalVisible}
      editModalVisible={editModalVisible}
      openCreateModal={openCreateModal}
      closeCreateModal={closeCreateModal}
      closeEditModal={closeEditModal}
      reset={(filters || fields) && reset}
      datePicker={{
        items: map(({ dataKey, ...others }) => ({
          dataKey,
          value: flow(find(propEq('dataKey')(dataKey)), prop('value'))(dates),
          ...others,
        }))(datePickers),
        onSelect: onDateChange,
      }}
    />,
  };
};

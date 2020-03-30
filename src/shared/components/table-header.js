import React from 'react';
import { string, func, shape, arrayOf, array, number, oneOfType, object, bool } from 'prop-types';
import { Input, Button, Select, DatePicker } from 'antd';
import Link from 'shared/components/link';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, flow, join, prop } from 'lodash/fp';
import FormModal from './edit-modal';

import s from './table-header.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const result = ({
  query,
  createLink,
  filter,
  reset,
  datePicker,
  createModalVisible,
  editModalVisible,
  createModal,
  editModal,
  openCreateModal,
  closeCreateModal,
  closeEditModal,
  onCreateSubmit,
  onEditSubmit,
}) => {
  useStyles(s);

  return (
    <div className={s.Root}>
      {createModal && (
        <FormModal
          title={createModal.title || '创建'}
          visible={createModalVisible}
          onCancel={closeCreateModal}
          onSubmit={onCreateSubmit}
          initialValues={createModal.initialValues}
          fields={createModal.fields}
          layout={createModal.layout}
        />
      )}

      {editModal && (
        <FormModal
          title={editModal.title || '编辑'}
          visible={editModalVisible}
          onCancel={closeEditModal}
          onSubmit={onEditSubmit}
          initialValues={editModal.initialValues}
          fields={editModal.fields}
          layout={editModal.layout}
        />
      )}

      <div className={s.operations}>
        {query && (
          <div>
            {!query.fussy && (
              <Select
                onSelect={query.onFieldChange}
                value={query.field}
                style={{ marginRight: 10 }}
                dropdownMatchSelectWidth={false}
              >
                {map(({ key, text }) => (
                  <Option
                    value={key}
                    key={key}
                  >
                    {text}
                  </Option>
                ))(query.fields)}
              </Select>
            )}
            <Search
              style={{ width: query.width || 300 }}
              placeholder={query.placeholder || (query.fussy ? `根据 ${flow(map(prop('text')), join('、'))(query.fields)} 搜索` : '搜索')}
              onChange={query.onValueChange}
              value={query.value}
            />
          </div>
        )}

        {filter && map(({
          label,
          options,
          placeholder,
          dataKey,
          value,
          dropdownMatchSelectWidth = false,
        }) => (
          <div key={dataKey}>
            <span style={{ marginRight: 10 }}>{label}</span>
            <Select
              onSelect={(selectedValue) => filter.onSelect(selectedValue, dataKey)}
              placeholder={placeholder}
              value={value}
              dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            >
              {map(({ text, value: optionValue, disabled, className: optionClassName }) => (
                <Option
                  value={optionValue}
                  key={optionValue}
                  disabled={disabled}
                  className={optionClassName}
                >
                  {text}
                </Option>
              ))(options)}
            </Select>
          </div>
        ))(filter.items)}

        {datePicker && map(({ label, dataKey, disabledDate }) => (
          <div key={dataKey}>
            <span style={{ marginRight: 10 }}>{label}</span>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={(_, selectedValue) => datePicker.onSelect(selectedValue, dataKey)}
              disabledDate={disabledDate}
            />
          </div>
        ))(datePicker.items)}

        {reset && (
          <Button onClick={reset}>重置</Button>
        )}
      </div>

      {createModal && (
        <Button type="primary" size="large" onClick={openCreateModal}>
          {createModal.title || '创建'}
        </Button>
      )}

      {createLink && (
        <Link to={createLink.link}>
          <Button type="primary" size="large">
            {createLink.text}
          </Button>
        </Link>
      )}
    </div>
  );
};

result.propTypes = {
  query: shape({
    onFieldChange: func.isRequired,
    onValueChange: func.isRequired,
    field: string.isRequired,
    value: string,
    width: number,
    fields: array.isRequired,
    placeholder: string,
  }),
  createLink: shape({
    text: string.isRequired,
    link: string.isRequired,
  }),
  filter: shape({
    items: arrayOf(shape({
      label: string,
      placeholder: string,
      options: array.isRequired,
      dataKey: string.isRequired,
      disabled: bool,
      value: oneOfType([string, number]),
    })).isRequired,
    onSelect: func.isRequired,
  }),
  createModal: shape({
    title: string,
    onSubmit: func,
    initialValues: object,
    fields: arrayOf(shape({
      name: string.isRequired,
      label: string.isRequired,
      type: string,
      options: array,
      placeholder: string,
      validate: oneOfType([func, array]),
    })),
    layout: object,
  }),
  editModal: shape({
    title: string,
    onSubmit: func,
    initialValues: object,
    fields: arrayOf(shape({
      name: string.isRequired,
      label: string.isRequired,
      type: string,
      options: array,
      placeholder: string,
      validate: oneOfType([func, array]),
    })),
    layout: object,
  }),
  openCreateModal: func,
  closeCreateModal: func,
  closeEditModal: func,
  createModalVisible: bool,
  editModalVisible: bool,
  onCreateSubmit: func.isRequired,
  onEditSubmit: func.isRequired,
  datePicker: shape({
    items: arrayOf(shape({
      label: string,
      dataKey: string.isRequired,
      value: array,
      disabledDate: func,
    })).isRequired,
    onSelect: func.isRequired,
  }),
  reset: func,
};

result.displayName = __filename;

export default result;

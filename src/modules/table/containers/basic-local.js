import React from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Table } from 'antd';
import { prop, includes, flow, split, nth, toUpper } from 'lodash/fp';
import { useLocalTable, useTableSearch } from 'relient-admin/hooks';

import selector from './local-selector';

const result = () => {
  const {
    data,
    roleEntity,
    roleOptions,
  } = useSelector(selector);

  const {
    tableHeader,
    getDataSource,
    pagination,
    changeCustomQuery,
  } = useLocalTable({
    query: {
      fields: [{
        key: 'name',
        text: '姓名',
      }, {
        key: 'email',
        text: '邮件',
      }, {
        key: 'phoneNumber',
        text: '手机号',
      }, {
        key: 'username',
        text: '用户名',
      }],
    },
    showReset: true,
  });

  const searchNameProps = useTableSearch({
    changeFilterValue: changeCustomQuery,
    dataKey: 'name',
    placeholder: 'Default exact match',
  });
  const searchEmailProps = useTableSearch({
    changeFilterValue: changeCustomQuery,
    dataKey: 'email',
    placeholder: 'Search by email type',
    onFilter: (item, field, value) => {
      const emailType = flow(prop(field), split('@'), nth(1), toUpper)(item);
      return includes(toUpper(value))(emailType);
    },
  });
  const searchPhoneNumberProps = useTableSearch({
    changeFilterValue: changeCustomQuery,
    dataKey: 'phoneNumber',
    placeholder: 'Fussy match',
    onFilter: (item, filed, value) => includes(toUpper(value))(flow(prop(filed), toUpper)(item)),
  });
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    ...searchNameProps,
  }, {
    title: '邮件',
    dataIndex: 'email',
    ...searchEmailProps,
  }, {
    title: '手机号',
    dataIndex: 'phoneNumber',
    ...searchPhoneNumberProps,
  }, {
    title: '用户名',
    dataIndex: 'username',
  }, {
    title: '角色',
    dataIndex: 'roleKey',
    width: 110,
    filters: roleOptions,
    onFilter: (value, record) => record.roleKey === value,
    render: (roleKey) => prop(`${roleKey}.name`)(roleEntity),
  }];

  return (
    <Layout>
      {tableHeader}
      <Table dataSource={getDataSource(data)} columns={columns} rowKey="id" pagination={pagination} />
    </Layout>
  );
};

result.displayName = __filename;

export default result;

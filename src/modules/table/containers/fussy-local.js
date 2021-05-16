import React from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Table } from 'antd';
import { prop } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';

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
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '姓名',
      }, {
        dataKey: 'email',
        label: '邮件',
      }, {
        dataKey: 'phoneNumber',
        label: '手机号',
      }, {
        dataKey: 'username',
        label: '用户名',
      }],
      fussy: true,
    },
  });
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
  }, {
    title: '邮件',
    dataIndex: 'email',
  }, {
    title: '手机号',
    dataIndex: 'phoneNumber',
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

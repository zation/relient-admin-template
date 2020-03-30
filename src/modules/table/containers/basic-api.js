import React from 'react';
import { array, number } from 'prop-types';
import Layout from 'shared/components/layout';
import { Table } from 'antd';
import { map, flow } from 'lodash/fp';
import useSearch from 'shared/hook/use-pagination-search';
import { readAll as readAllOrdersAction } from 'shared/actions/order';
import { time } from 'relient/formatters';
import { getEntity } from 'relient/selectors';
import useAction from 'shared/hook/use-action';

const getDataSource = (state) => map((id) => flow(
  getEntity(`order.${id}`),
  (order) => ({
    ...order,
    account: getEntity(`account.${order.accountId}`)(state),
  }),
)(state));

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const readAllOrders = useAction(readAllOrdersAction);
  const {
    tableHeader,
    data,
    pagination,
  } = useSearch({
    paginationInitialData: {
      ids,
      total,
      current,
      size,
    },
    pagination: {
      getDataSource,
      size,
    },
    readAction: readAllOrders,
    query: {
      fields: [{
        key: 'name',
        text: '订单名称',
      }, {
        key: 'serialNumber',
        text: '订单号',
      }],
    },
  });
  const columns = [{
    title: '订单号',
    dataIndex: 'serialNumber',
  }, {
    title: '订单名称',
    dataIndex: 'name',
  }, {
    title: '用户',
    dataIndex: ['account', 'email'],
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    render: time(),
  }];

  return (
    <Layout>
      {tableHeader}
      <Table dataSource={data} columns={columns} rowKey="id" pagination={pagination} />
    </Layout>
  );
};

result.propTypes = {
  ids: array.isRequired,
  total: number.isRequired,
  current: number.isRequired,
  size: number.isRequired,
};

result.displayName = __filename;

export default result;

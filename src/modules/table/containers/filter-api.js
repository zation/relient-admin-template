import React from 'react';
import { array, number } from 'prop-types';
import Layout from 'shared/components/layout';
import { Button, Table, Drawer, Select } from 'antd';
import { map, flow } from 'lodash/fp';
import { useAction } from 'relient/actions';
import { useAPITable, useTableFilter, useTableSearch } from 'relient-admin/hooks';
import {
  readAll as readAllOrdersAction,
  update as updateOrderAction,
  create as createOrderAction,
} from 'shared/actions/order';
import { time } from 'relient/formatters';
import { getEntity, getEntityArray } from 'relient/selectors';
import { orderStatusOptions, PENDING } from 'shared/constants/order-status';
import { useSelector } from 'react-redux';

const getDataSource = (state) => map((id) => flow(
  getEntity(`order.${id}`),
  (order) => ({
    ...order,
    account: getEntity(`account.${order.accountId}`)(state),
  }),
)(state));

const fields = [{
  label: '订单名称',
  name: 'name',
  type: 'text',
  rules: [{ required: true }],
}, {
  label: '订单状态',
  name: 'status',
  component: Select,
  options: orderStatusOptions,
  rules: [{ required: true }],
}];

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const readAllOrders = useAction(readAllOrdersAction);
  const createOrder = useAction(createOrderAction);
  const updateOrder = useAction(updateOrderAction);
  const accountOptions = useSelector(flow(
    getEntityArray('account'),
    map(({ email, id }) => ({ value: id, text: email })),
  ));

  const {
    tableHeader,
    data,
    pagination,
    openEditor,
    changeFilterValue,
  } = useAPITable({
    paginationInitialData: {
      ids,
      total,
      current,
      size,
    },
    getDataSource,
    readAction: readAllOrders,
    query: {
      fields: [{
        dataKey: 'name',
        label: '订单名称',
      }, {
        dataKey: 'serialNumber',
        label: '订单号',
      }],
    },
    createButton: {
      text: '创建订单',
    },
    creator: {
      title: '创建订单',
      initialValues: { status: PENDING },
      onSubmit: createOrder,
      fields,
      component: Drawer,
    },
    editor: {
      title: '编辑帐号',
      onSubmit: updateOrder,
      fields,
      component: Drawer,
    },
  });
  const filterProps = useTableFilter({ changeFilterValue, dataKey: 'accountIds', options: accountOptions });
  const searchProps = useTableSearch({ changeFilterValue, dataKey: 'name' });
  const columns = [{
    title: '订单号',
    dataIndex: 'serialNumber',
  }, {
    title: '订单名称',
    dataIndex: 'name',
    ...searchProps,
  }, {
    title: '用户',
    dataIndex: ['account', 'email'],
    ...filterProps,
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    render: time(),
  }, {
    title: '操作',
    key: 'operations',
    width: 200,
    render: (record) => (
      <Button
        type="primary"
        onClick={() => openEditor(record)}
        style={{ marginBottom: 10, marginRight: 10 }}
        size="small"
        ghost
      >
        编辑
      </Button>
    ),
  }];

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={pagination}
      />
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

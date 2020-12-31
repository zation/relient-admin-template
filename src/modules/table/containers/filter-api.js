import React from 'react';
import { array, number } from 'prop-types';
import Layout from 'shared/components/layout';
import { Button, Table, Drawer } from 'antd';
import { map, flow } from 'lodash/fp';
import { useAPITable, useAction, useTableFilter } from 'relient-admin/hooks';
import {
  readAll as readAllOrdersAction,
  update as updateOrderAction,
  create as createOrderAction,
} from 'shared/actions/order';
import { time } from 'relient/formatters';
import { getEntity, getEntityArray } from 'relient/selectors';
import { required } from 'shared/utils/validators';
import { Select } from 'relient-admin/components';
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
  required: true,
  validate: required,
}, {
  label: '订单状态',
  name: 'status',
  component: Select,
  options: orderStatusOptions,
  required: true,
  validate: required,
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
        key: 'name',
        text: '订单名称',
      }, {
        key: 'serialNumber',
        text: '订单号',
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
  const columns = [{
    title: '订单号',
    dataIndex: 'serialNumber',
  }, {
    title: '订单名称',
    dataIndex: 'name',
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

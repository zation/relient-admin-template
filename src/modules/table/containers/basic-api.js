import React from 'react';
import { array, number } from 'prop-types';
import Layout from 'shared/components/layout';
import { Button, Table } from 'antd';
import { map, flow } from 'lodash/fp';
import useTable from 'relient-admin/hooks/use-api-table';
import {
  readAll as readAllOrdersAction,
  update as updateOrderAction,
  create as createOrderAction,
} from 'shared/actions/order';
import { time } from 'relient/formatters';
import { getEntity } from 'relient/selectors';
import useAction from 'relient-admin/hooks/use-action';
import { required } from 'shared/utils/validators';
import { Select, FormDrawer } from 'relient-admin/components';
import { orderStatusOptions, PENDING } from 'shared/constants/order-status';

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

  const {
    tableHeader,
    data,
    pagination,
    openEditor,
  } = useTable({
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
    creator: {
      title: '创建订单',
      initialValues: { status: PENDING },
      onSubmit: createOrder,
      fields,
      component: FormDrawer,
    },
    editor: {
      title: '编辑帐号',
      onSubmit: updateOrder,
      fields,
      component: FormDrawer,
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

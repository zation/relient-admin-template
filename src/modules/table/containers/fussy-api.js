import React from 'react';
import { array, number } from 'prop-types';
import Layout from 'shared/components/layout';
import { Button, Table } from 'antd';
import { map, flow } from 'lodash/fp';
import useSearch from 'shared/hook/use-pagination-search';
import { time } from 'relient/formatters';
import { getEntity } from 'relient/selectors';
import useAction from 'shared/hook/use-action';
import { orderStatusOptions, PENDING } from 'shared/constants/order-status';
import {
  readAll as readAllOrdersAction,
  update as updateOrderAction,
  create as createOrderAction,
} from 'shared/actions/order';
import { required } from 'shared/utils/validators';
import Select from 'shared/components/fields/select';

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
      fussyKey: 'serialNumberOrName',
      placeholder: '根据 订单号、订单名称 搜索',
    },
    showReset: true,
    creator: {
      title: '创建订单',
      initialValues: { status: PENDING },
      onSubmit: createOrder,
      fields,
    },
    editor: {
      title: '编辑帐号',
      onSubmit: updateOrder,
      fields,
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

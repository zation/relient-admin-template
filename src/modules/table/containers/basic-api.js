import React from 'react';
import { array, number } from 'prop-types';
import Layout from 'shared/components/layout';
import { Button, Table, Drawer, Select } from 'antd';
import { map, flow, prop } from 'lodash/fp';
import { useAction } from 'relient/actions';
import { useAPITable } from 'relient-admin/hooks';
import {
  readAll as readAllOrdersAction,
  update as updateOrderAction,
  create as createOrderAction,
} from 'shared/actions/order';
import { time } from 'relient/formatters';
import { getEntity } from 'relient/selectors';
import { orderStatusOptions, PENDING } from 'shared/constants/order-status';
import { Images, MultipleUploader } from 'relient-admin/components';

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
}, {
  label: '多张图片',
  name: 'images',
  component: MultipleUploader,
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
  const columns = [{
    title: '订单号',
    dataIndex: 'serialNumber',
  }, {
    title: '订单名称',
    dataIndex: 'name',
  }, {
    title: '多张图片',
    dataIndex: 'images',
    render: (images) => <Images images={map(prop('url'))(images)} space={20} width={60} />,
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

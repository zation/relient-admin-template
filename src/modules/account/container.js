import React, { useState, useCallback } from 'react';
import { array } from 'prop-types';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Select, Switch as SwitchField, FormPop, getSwitchStatus } from 'relient-admin/components';
import { Table, Message, Button, Drawer, Modal } from 'antd';
import { create as createAction, update as updateAction } from 'shared/actions/account';
import { required, password, confirmedPassword, phoneNumber } from 'shared/utils/validators';
import { prop } from 'lodash/fp';
import { formatNormalStatus, parseNormalStatus } from 'relient-admin/constants/normal-status';
import { useAction, useLocalTable } from 'relient-admin/hooks';

import selector from './selector';

const SwitchStatus = getSwitchStatus(updateAction);
const passwordFields = [{
  label: '密码',
  name: 'password',
  type: 'password',
  required: true,
  validate: password,
}, {
  label: '重复密码',
  name: 'confirmedPassword',
  type: 'password',
  required: true,
  validate: confirmedPassword,
}];

const result = ({ roleKeys }) => {
  const {
    data,
    roleOptions,
    roleEntity,
    createInitialValues,
  } = useSelector(selector({ roleKeys }));
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const openPasswordModal = useCallback((item) => {
    setPasswordModalVisible(true);
    setEditItem(item);
  }, []);
  const closePasswordModal = useCallback(() => {
    setPasswordModalVisible(false);
    setEditItem(null);
  }, []);
  const update = useAction(updateAction);
  const create = useAction(createAction);
  const onPasswordSubmit = useCallback(async (values) => {
    await update({
      ...values,
      id: editItem.id,
    });
    closePasswordModal();
    Message.success('编辑成功');
  }, [editItem]);

  const fields = [{
    label: '用户名',
    name: 'username',
    type: 'text',
    required: true,
    validate: required,
  }, {
    label: '角色',
    name: 'roleKey',
    component: Select,
    options: roleOptions,
    required: true,
    validate: required,
  }, {
    label: '姓名',
    name: 'name',
    type: 'text',
    required: true,
    validate: required,
  }, {
    label: '手机号',
    name: 'phoneNumber',
    type: 'text',
    required: true,
    validate: phoneNumber,
  }, {
    label: '邮件',
    name: 'email',
    type: 'text',
  }, {
    label: '是否激活',
    name: 'status',
    component: SwitchField,
    required: true,
    format: formatNormalStatus,
    parse: parseNormalStatus,
  }];

  const {
    openEditor,
    tableHeader,
    getDataSource,
    pagination,
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
    creator: {
      title: '创建帐号',
      initialValues: createInitialValues,
      onSubmit: create,
      fields: [...fields, ...passwordFields],
      component: Drawer,
    },
    editor: {
      title: '编辑帐号',
      onSubmit: update,
      fields,
      component: Drawer,
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
    render: (roleKey) => prop(`${roleKey}.name`)(roleEntity),
  }, {
    title: '是否激活',
    width: 100,
    render: SwitchStatus,
  }, {
    title: '操作',
    key: 'operations',
    width: 200,
    render: (record) => (
      <>
        <Button
          type="primary"
          onClick={() => openEditor(record)}
          style={{ marginBottom: 10, marginRight: 10 }}
          size="small"
          ghost
        >
          编辑
        </Button>
        <Button type="danger" onClick={() => openPasswordModal(record)} size="small" ghost>修改密码</Button>
      </>
    ),
  }];

  return (
    <Layout>
      {tableHeader}
      <Table dataSource={getDataSource(data)} columns={columns} rowKey="id" pagination={pagination} />
      <FormPop
        component={Modal}
        visible={passwordModalVisible}
        close={closePasswordModal}
        onSubmit={onPasswordSubmit}
        fields={passwordFields}
        title="编辑密码"
      />
    </Layout>
  );
};

result.propTypes = {
  roleKeys: array,
};

result.displayName = __filename;

export default result;

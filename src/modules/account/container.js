import React, { useState, useCallback } from 'react';
import { array } from 'prop-types';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { FormPop, getSwitchStatus } from 'relient-admin/components';
import { Table, message, Button, Drawer, Modal, Switch, Select } from 'antd';
import { create as createAction, update as updateAction } from 'shared/actions/account';
import useRules from 'shared/hooks/use-rules';
import { prop } from 'lodash/fp';
import { formatNormalStatus, parseNormalStatus } from 'relient-admin/constants/normal-status';
import { useAction } from 'relient/actions';
import { useLocalTable } from 'relient-admin/hooks';

import selector from './selector';

const SwitchStatus = getSwitchStatus(updateAction);

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
    message.success('编辑成功');
  }, [editItem]);
  const { sameAsRule, phoneNumber, password } = useRules();

  const passwordFields = [{
    label: '密码',
    name: 'password',
    type: 'password',
    rules: [{ required: true }, password],
  }, {
    label: '重复密码',
    name: 'confirmedPassword',
    type: 'password',
    validate: [{ required: true }, sameAsRule('password', '密码')],
  }];

  const fields = [{
    label: '用户名',
    name: 'username',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '角色',
    name: 'roleKey',
    component: Select,
    options: roleOptions,
    rules: [{ required: true }],
  }, {
    label: '姓名',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '手机号',
    name: 'phoneNumber',
    type: 'text',
    validate: [{ required: true }, phoneNumber],
  }, {
    label: '邮件',
    name: 'email',
    type: 'text',
    rules: [{ type: 'email' }],
  }, {
    label: '是否激活',
    name: 'status',
    component: Switch,
    rules: [{ required: true }],
    valuePropName: 'checked',
    getValueFromEvent: formatNormalStatus,
    normalize: parseNormalStatus,
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
        label: '姓名',
      }, {
        key: 'email',
        label: '邮件',
      }, {
        key: 'phoneNumber',
        label: '手机号',
      }, {
        key: 'username',
        label: '用户名',
      }],
    },
    createButton: {
      text: '创建帐号',
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
        onClose={closePasswordModal}
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

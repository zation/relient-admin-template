import React, { useState, useCallback } from 'react';
import { array } from 'prop-types';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import Select from 'shared/components/fields/select';
import SwitchField from 'shared/components/fields/switch';
import { Table, Switch, Message, Button } from 'antd';
import { create as createAction, update as updateAction } from 'shared/actions/account';
import { required, password, confirmedPassword, phoneNumber } from 'shared/utils/validators';
import { prop } from 'lodash/fp';
import useToggleNormalStatus from 'shared/hook/use-toggle-normal-status';
import { formatNormalStatus, parseNormalStatus } from 'shared/constants/normal-status';
import FormModal from 'shared/components/form-modal';
import FormDrawer from 'shared/components/form-drawer';
import useAction from 'shared/hook/use-action';
import useSearch from 'shared/hook/use-search';

import selector from './selector';

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
  const toggleNormalStatus = useToggleNormalStatus({ update });
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
  } = useSearch({
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
      component: FormDrawer,
    },
    editor: {
      title: '编辑帐号',
      onSubmit: update,
      fields,
      component: FormDrawer,
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
    width: 100,
    render: (roleKey) => prop(`${roleKey}.name`)(roleEntity),
  }, {
    title: '是否激活',
    dataIndex: 'status',
    width: 100,
    render: (status, record) => <Switch checked={status === 'ACTIVE'} onChange={() => toggleNormalStatus(record)} />,
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
      <FormModal
        visible={passwordModalVisible}
        onCancel={closePasswordModal}
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

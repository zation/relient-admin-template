import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { message } from 'antd';
import { Form, Editor } from 'relient-admin/components';
import { update as updateAction } from 'shared/actions/account';
import { getCurrentAccount } from 'shared/selectors/account';
import { flow, prop } from 'lodash/fp';
import useRules from 'shared/hooks/use-rules';
import { getEntity } from 'relient/selectors';
import { useAction } from 'relient/actions';

const result = () => {
  const {
    accountId,
    initialValues,
  } = useSelector((state) => ({
    accountId: flow(getCurrentAccount, prop('id'))(state),
    initialValues: flow(
      getCurrentAccount,
      (account) => ({
        ...account,
        roleName: getEntity(`role.${prop('roleKey')(account)}.name`)(state),
      }),
    )(state),
  }));
  const { phoneNumber } = useRules();
  const fields = [{
    label: '用户名',
    name: 'username',
    type: 'text',
    rules: [{ required: true }],
  }, {
    element: <span>{initialValues.roleName}</span>,
    label: '角色',
  }, {
    label: '姓名',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '手机号',
    name: 'phoneNumber',
    type: 'text',
    rules: [{ required: true }, phoneNumber],
  }, {
    label: '邮件',
    name: 'email',
    type: 'email',
  }, {
    label: '自我介绍',
    name: 'introduction',
    component: Editor,
  }];
  const update = useAction(updateAction);
  const onSubmit = useCallback(async (values) => {
    await update({
      ...values,
      id: accountId,
    });
    message.success('修改成功');
  }, [update]);

  return (
    <Layout hideNursingDropDown>
      <Form
        checkEditing
        onSubmit={onSubmit}
        fields={fields}
        initialValues={initialValues}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;

import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Message } from 'antd';
import { update as updateAction } from 'shared/actions/account';
import { getCurrentAccount } from 'shared/selectors/account';
import { flow, prop, pick, map } from 'lodash/fp';
import { phoneNumber, required } from 'shared/utils/validators';
import { PlainText, Form } from 'relient-admin/components';
import { getEntity } from 'relient/selectors';
import useAction from 'relient-admin/hooks/use-action';

const fields = [{
  label: '用户名',
  name: 'username',
  type: 'text',
  required: true,
  validate: required,
}, {
  label: '角色',
  name: 'roleName',
  component: PlainText,
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
}];

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
  const update = useAction(updateAction);
  const onSubmit = useCallback(async (values) => {
    await update({
      ...pick(map(prop('name'))(fields))(values),
      id: accountId,
    });
    Message.success('修改成功');
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

import React, { useCallback } from 'react';
import Layout from 'shared/components/layout';
import { Message } from 'antd';
import { resetMinePassword as resetMinePasswordAction } from 'shared/actions/account';
import { password, confirmedNewPassword } from 'shared/utils/validators';
import { Form } from 'relient-admin/components';
import { useAction } from 'relient-admin/hooks';

const fields = [{
  name: 'oldPassword',
  label: '旧密码',
  required: true,
  validate: password,
  type: 'password',
}, {
  name: 'newPassword',
  label: '新密码',
  required: true,
  validate: password,
  type: 'password',
}, {
  name: 'confirmedNewPassword',
  label: '重复新密码',
  required: true,
  validate: confirmedNewPassword,
  type: 'password',
}];

const result = () => {
  const resetPassword = useAction(resetMinePasswordAction);
  const onSubmit = useCallback(async (values, { reset, resetFieldState }) => {
    await resetPassword(values);
    Message.success('修改成功');
    setTimeout(() => {
      resetFieldState('oldPassword');
      resetFieldState('newPassword');
      resetFieldState('confirmedNewPassword');
      reset();
    });
  }, []);

  return (
    <Layout>
      <Form
        onSubmit={onSubmit}
        fields={fields}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;

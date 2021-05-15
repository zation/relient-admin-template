import React, { useCallback, useMemo } from 'react';
import Layout from 'shared/components/layout';
import { message } from 'antd';
import { resetMinePassword as resetMinePasswordAction } from 'shared/actions/account';
import useRules from 'shared/hooks/use-rules';
import { Form } from 'relient-admin/components';
import { useAction } from 'relient/actions';

const result = () => {
  const resetPassword = useAction(resetMinePasswordAction);
  const { password, sameAsRule } = useRules();
  const fields = useMemo(() => [{
    name: 'oldPassword',
    label: '旧密码',
    rules: [{ required: true, ...password }],
    type: 'password',
  }, {
    name: 'newPassword',
    label: '新密码',
    rules: [{ required: true, ...password }],
    type: 'password',
  }, {
    name: 'confirmedNewPassword',
    label: '重复新密码',
    rules: [{ required: true, ...password }, sameAsRule('newPassword', '新密码')],
    type: 'password',
  }], [password, sameAsRule]);
  const onSubmit = useCallback(async (values, { resetFields }) => {
    await resetPassword(values);
    message.success('修改成功');
    resetFields();
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

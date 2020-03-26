import React, { useCallback } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Form, Button, Message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Input from 'shared/components/fields/input';
import { useDispatch } from 'react-redux';
import { push as pushAction } from 'relient/actions/history';
import { username, password, required } from 'shared/utils/validators';
import { login as loginAction } from 'shared/actions/auth';
import { PROFILE } from 'shared/constants/features';
import Captcha from 'shared/components/captcha';
import getPreloader from 'shared/utils/preloader';
import { Field, Form as FinalForm } from 'react-final-form';
import Layout from './layout';

import s from './base.less';

const { Item } = Form;

const result = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const onSubmit = useCallback(async (values) => {
    const { account } = await dispatch(loginAction({ ...values }));
    await Promise.all(getPreloader(account, dispatch));
    Message.success('登录成功');
    dispatch(pushAction(PROFILE));
  }, []);

  return (
    <Layout className={s.Root}>
      <FinalForm onSubmit={onSubmit}>
        {({ submitting, handleSubmit }) => (
          <Form onFinish={handleSubmit}>
            <Field
              name="username"
              component={Input}
              htmlType="text"
              placeholder="帐号"
              validate={username}
              size="large"
              prefix={<UserOutlined />}
            />
            <Field
              name="password"
              component={Input}
              htmlType="password"
              placeholder="密码"
              validate={password}
              size="large"
              prefix={<LockOutlined />}
            />
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <Field
                  name="captcha"
                  component={Input}
                  htmlType="text"
                  placeholder="验证码"
                  validate={required}
                  size="large"
                />
              </div>
              <div className={s.Captcha}>
                <Captcha height={40} />
              </div>
            </div>
            <Item className={s.Operation}>
              <Button size="large" loading={submitting} className={s.Submit} type="primary" htmlType="submit">
                登录
              </Button>
            </Item>
          </Form>
        )}
      </FinalForm>
    </Layout>
  );
};

result.displayName = __filename;

export default result;

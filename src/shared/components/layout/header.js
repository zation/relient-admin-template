import React from 'react';
import { string, func } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Layout, Dropdown, Menu } from 'antd';
import Link from 'shared/components/link';
import { PASSWORD, PROFILE } from 'shared/constants/features';
import { LogoutOutlined } from '@ant-design/icons';

import s from './header.less';

const { Header } = Layout;
const { Item, Divider } = Menu;

const result = ({
  email,
  username,
  logout,
}) => {
  useStyles(s);

  return (
    <Header className={s.Header}>
      <span className={s.Title}>Relient Admin</span>

      <Dropdown
        overlay={(
          <Menu className={s.Menu} selectedKeys={[]}>
            <Item>
              <Link feature={PROFILE} showIcon />
            </Item>
            <Item>
              <Link feature={PASSWORD} showIcon />
            </Item>
            <Divider />
            <Item onClick={logout}>
              <LogoutOutlined />
              登出
            </Item>
          </Menu>
        )}
      >
        <div className={s.Action}>
          <span>{username || email}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

result.propTypes = {
  email: string,
  username: string,
  logout: func.isRequired,
};

result.displayName = __filename;

export default result;

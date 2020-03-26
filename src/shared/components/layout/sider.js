import React from 'react';
import { array } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Layout, Menu } from 'antd';
import Link from 'shared/components/link';
import { map } from 'lodash/fp';
import Icon from '@ant-design/icons';

import s from './sider.less';

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

const result = ({ selectedFeatureKeys, features }) => {
  useStyles(s);

  return (
    <Sider
      theme="light"
      trigger={null}
      breakpoint="md"
      width={256}
      className={s.Root}
    >
      <Menu
        theme="light"
        mode="inline"
        style={{ padding: '16px 0', width: '100%' }}
        selectedKeys={selectedFeatureKeys}
        defaultOpenKeys={selectedFeatureKeys}
      >
        {map(({ icon, items, text, key }) => (items ? (
          <SubMenu
            title={(
              <>
                {icon && <Icon component={icon} />}
                <span>{text}</span>
              </>
            )}
            key={key}
          >
            {map(({ key: itemKey }) => (
              <Item key={itemKey}>
                <Link showIcon feature={itemKey} />
              </Item>
            ))(items)}
          </SubMenu>
        ) : (
          <Item key={key}>
            <Link showIcon feature={key} />
          </Item>
        )))(features)}
      </Menu>
    </Sider>
  );
};

result.propTypes = {
  selectedFeatureKeys: array.isRequired,
  features: array.isRequired,
};

result.displayName = __filename;

export default result;

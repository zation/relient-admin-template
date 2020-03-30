import React from 'react';
import { array, elementType, string } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Layout, Menu } from 'antd';
import Link from 'shared/components/link';
import { map } from 'lodash/fp';
import Icon from '@ant-design/icons';

import s from './sider.less';

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

const MenuItem = ({
  icon,
  items,
  text,
  key,
}) => (items ? (
  <SubMenu
    title={(
      <>
        {icon && <Icon component={icon} />}
        <span>{text}</span>
      </>
    )}
    key={key}
  >
    {map(MenuItem)(items)}
  </SubMenu>
) : (
  <Item key={key}>
    <Link showIcon feature={key} />
  </Item>
));

MenuItem.propTypes = {
  icon: elementType,
  items: array,
  text: string,
  key: string.isRequired,
};

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
        {map(MenuItem)(features)}
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

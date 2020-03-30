import { prop, last, flow, join, map } from 'lodash/fp';

export const ACCOUNT = 'ACCOUNT';
export const ADMIN_ACCOUNT = 'ADMIN_ACCOUNT';

export const PERSONAL = 'PERSONAL';
export const PASSWORD = 'PASSWORD';
export const PROFILE = 'PROFILE';

export const TABLE = 'TABLE';
export const LOCAL_PAGINATION_TABLE = 'LOCAL_PAGINATION_TABLE';
export const BASIC_LOCAL_PAGINATION_TABLE = 'BASIC_LOCAL_PAGINATION_TABLE';
export const API_PAGINATION_TABLE = 'API_PAGINATION_TABLE';
export const BASIC_PAGINATION_DATA_TABLE = 'BASIC_PAGINATION_DATA_TABLE';

export const features = [{
  key: ACCOUNT,
  link: 'account',
  text: '账户管理',
  items: [{
    key: ADMIN_ACCOUNT,
    link: 'admin',
    text: '管理员',
  }],
}, {
  key: PERSONAL,
  link: 'personal',
  text: '个人信息',
  items: [{
    key: PROFILE,
    link: 'profile',
    text: '信息管理',
  }, {
    key: PASSWORD,
    link: 'password',
    text: '修改密码',
  }],
}, {
  key: TABLE,
  link: 'table',
  text: '表格演示',
  items: [{
    key: LOCAL_PAGINATION_TABLE,
    link: 'local',
    text: '本地分页表格',
    items: [{
      key: BASIC_LOCAL_PAGINATION_TABLE,
      link: 'basic',
      text: '基础',
    }],
  }, {
    key: API_PAGINATION_TABLE,
    link: 'api',
    text: '分页数据表格',
    items: [{
      key: BASIC_PAGINATION_DATA_TABLE,
      link: 'basic',
      text: '基础',
    }],
  }],
}];

export const getSelectedFeatures = (key, items = features, previous = []) => {
  for (let index = 0; index < items.length; index += 1) {
    const feature = items[index];
    if (feature.key === key) {
      return [...previous, feature];
    }
    if (feature.items) {
      const result = getSelectedFeatures(key, feature.items, [...previous, feature]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const getFeatureBy = (attribute) => (key) => {
  const selectedFeatures = getSelectedFeatures(key);
  if (attribute === 'link') {
    return `/${flow(map(prop('link')), join('/'))(selectedFeatures)}`;
  }
  return flow(last, prop(attribute))(selectedFeatures);
};

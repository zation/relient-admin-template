import { prop, last, flow, join, map } from 'lodash/fp';

export const ACCOUNT = 'ACCOUNT';
export const ADMIN_ACCOUNT = 'ADMIN_ACCOUNT';

export const PERSONAL = 'PERSONAL';
export const PASSWORD = 'PASSWORD';
export const PROFILE = 'PROFILE';

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
}];

export const getSelectedFeatures = (key) => {
  for (let index = 0; index < features.length; index += 1) {
    const feature = features[index];
    if (feature.key === key) {
      return [feature];
    }
    if (feature.items) {
      for (let itemIndex = 0; itemIndex < feature.items.length; itemIndex += 1) {
        const itemFeature = feature.items[itemIndex];
        if (itemFeature.key === key) {
          return [feature, itemFeature];
        }
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

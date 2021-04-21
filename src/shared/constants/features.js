import {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  LockOutlined,
  TableOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { setFeatures } from 'relient/features';

export const HOME = 'HOME';

export const ACCOUNT = 'ACCOUNT';
export const ADMIN_ACCOUNT = 'ADMIN_ACCOUNT';

export const PERSONAL = 'PERSONAL';
export const PASSWORD = 'PASSWORD';
export const PROFILE = 'PROFILE';

export const TABLE = 'TABLE';
export const LOCAL_PAGINATION_TABLE = 'LOCAL_PAGINATION_TABLE';
export const BASIC_LOCAL_PAGINATION_TABLE = 'BASIC_LOCAL_PAGINATION_TABLE';
export const FUSSY_LOCAL_PAGINATION_TABLE = 'FUSSY_LOCAL_PAGINATION_TABLE';
export const API_PAGINATION_TABLE = 'API_PAGINATION_TABLE';
export const BASIC_API_PAGINATION_TABLE = 'BASIC_API_PAGINATION_TABLE';
export const FUSSY_API_PAGINATION_TABLE = 'FUSSY_API_PAGINATION_TABLE';
export const FILTER_API_PAGINATION_TABLE = 'FILTER_API_PAGINATION_TABLE';

export const features = [{
  key: HOME,
  link: '/',
  text: '首页',
  icon: HomeOutlined,
}, {
  key: ACCOUNT,
  link: 'account',
  text: '账户管理',
  icon: TeamOutlined,
  items: [{
    key: ADMIN_ACCOUNT,
    link: 'admin',
    text: '管理员',
    icon: UserOutlined,
  }],
}, {
  key: PERSONAL,
  link: 'personal',
  text: '个人信息',
  icon: InfoCircleOutlined,
  items: [{
    key: PROFILE,
    link: 'profile',
    text: '信息管理',
    icon: SettingOutlined,
  }, {
    key: PASSWORD,
    link: 'password',
    text: '修改密码',
    icon: LockOutlined,
  }],
}, {
  key: TABLE,
  link: 'table',
  text: '表格演示',
  icon: TableOutlined,
  items: [{
    key: LOCAL_PAGINATION_TABLE,
    link: 'local',
    text: '本地数据表格',
    icon: TableOutlined,
    items: [{
      key: BASIC_LOCAL_PAGINATION_TABLE,
      link: 'basic',
      text: '基础',
      icon: TableOutlined,
    }, {
      key: FUSSY_LOCAL_PAGINATION_TABLE,
      link: 'fussy',
      text: '模糊搜索',
      icon: TableOutlined,
    }],
  }, {
    key: API_PAGINATION_TABLE,
    link: 'api',
    text: '远程数据表格',
    icon: TableOutlined,
    items: [{
      key: BASIC_API_PAGINATION_TABLE,
      link: 'basic',
      text: '基础',
      icon: TableOutlined,
    }, {
      key: FUSSY_API_PAGINATION_TABLE,
      link: 'fussy',
      text: '模糊搜索',
      icon: TableOutlined,
    }, {
      key: FILTER_API_PAGINATION_TABLE,
      link: 'filter',
      text: '按列过滤',
      icon: TableOutlined,
    }],
  }],
}];

setFeatures(features);

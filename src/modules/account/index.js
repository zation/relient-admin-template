import React from 'react';
import {
  ADMIN_ACCOUNT,
} from 'shared/constants/features';
import {
  ADMIN,
} from 'shared/constants/role-key';
import Account from './container';

export default async () => [{
  path: '/admin',
  feature: ADMIN_ACCOUNT,
  action: () => ({
    component: <Account roleKeys={[ADMIN]} />,
  }),
}];

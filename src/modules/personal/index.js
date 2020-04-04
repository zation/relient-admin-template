import React from 'react';
import { PASSWORD, PROFILE } from 'shared/constants/features';
import Password from './containers/reset-password';
import Profile from './containers/profile';

export default async () => [{
  path: '/password',
  feature: PASSWORD,
  component: <Password />,
}, {
  path: '/profile',
  feature: PROFILE,
  component: <Profile />,
}];

import React from 'react';
import { BASIC_LOCAL_PAGINATION_TABLE } from 'shared/constants/features';
import BasicLocal from './containers/basic-local';

export default async () => [{
  path: '/local/basic',
  feature: BASIC_LOCAL_PAGINATION_TABLE,
  action: () => ({
    component: <BasicLocal />,
  }),
}];

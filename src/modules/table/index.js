import React from 'react';
import {
  BASIC_LOCAL_PAGINATION_TABLE,
  FUSSY_LOCAL_PAGINATION_TABLE,
} from 'shared/constants/features';
import BasicLocal from './containers/basic-local';
import FussyLocal from './containers/fussy-local';

export default async () => [{
  path: '/local/basic',
  feature: BASIC_LOCAL_PAGINATION_TABLE,
  component: <BasicLocal />,
}, {
  path: '/local/fussy',
  feature: FUSSY_LOCAL_PAGINATION_TABLE,
  component: <FussyLocal />,
}];

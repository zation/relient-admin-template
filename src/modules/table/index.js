import React from 'react';
import {
  BASIC_LOCAL_PAGINATION_TABLE,
  FUSSY_LOCAL_PAGINATION_TABLE,
  BASIC_PAGINATION_DATA_TABLE,
} from 'shared/constants/features';
import { readAll as readAllOrders } from 'shared/actions/order';
import { map, prop } from 'lodash/fp';
import BasicLocal from './containers/basic-local';
import FussyLocal from './containers/fussy-local';
import BasicAPI from './containers/basic-api';

export default async () => [{
  path: '/local/basic',
  feature: BASIC_LOCAL_PAGINATION_TABLE,
  component: <BasicLocal />,
}, {
  path: '/local/fussy',
  feature: FUSSY_LOCAL_PAGINATION_TABLE,
  component: <FussyLocal />,
}, {
  path: '/api/basic',
  feature: BASIC_PAGINATION_DATA_TABLE,
  action: async ({ store: { dispatch } }) => {
    const {
      content,
      totalElements,
      number,
      size,
    } = await dispatch(readAllOrders({
      size: 10,
    }));
    return {
      component: <BasicAPI
        ids={map(prop('id'))(content)}
        total={totalElements}
        current={number}
        size={size}
      />,
    };
  },
}];

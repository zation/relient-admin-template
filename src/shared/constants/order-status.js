import { keys } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const PENDING = 'PENDING';
export const CANCELLED = 'CANCELLED';
export const PAID = 'PAID';

const textMap = {
  [PENDING]: '待付款',
  [CANCELLED]: '已取消',
  [PAID]: '已付款',
};

export const orderStatuses = keys(textMap);
export const getOrderStatusText = getText(textMap)();
export const orderStatusOptions = getOptions(textMap)();

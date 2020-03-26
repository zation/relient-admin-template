import {
  requiredValidator,
  sameAsValidator,
  minLengthValidator,
  maxLengthValidator,
  positiveNumberValidator,
  lessOrEqualThanValidator,
  moreOrEqualThanValidator,
} from 'relient/form';
import { isFinite, isNil, flow, size, split, nth } from 'lodash/fp';

export const composeValidators = (...validators) => (value, allValues, meta) => validators
  .reduce((error, validator) => error || validator(value, allValues, meta), undefined);
export const required = requiredValidator('必填项');
export const sameAs = sameAsValidator('输入与之前不同');
export const minLength = minLengthValidator('输入字符太少');
export const maxLength = maxLengthValidator('输入字符太多');
export const positiveNumber = positiveNumberValidator('请输入正数');
export const lessOrEqualThan = lessOrEqualThanValidator('输入数字过大');
export const moreOrEqualThan = moreOrEqualThanValidator('输入数字过大');
export const number = (value) => {
  if (value === '' || isNil(value) || isFinite(Number(value))) {
    return undefined;
  }
  return '请输入数字';
};

export const price = (value) => {
  if (value === '' || isNil(value)) {
    return undefined;
  }
  if (!isFinite(Number(value))) {
    return '请输入数字';
  }
  if (Number(value) > 0 && flow(split('.'), nth(1), size)(value) <= 2) {
    return undefined;
  }
  return '请输入大于等于 0 的数字，精度不大于小数点后 2 位';
};

export const requiredPrice = composeValidators(required, price);
export const username = required;
export const phoneNumber = minLength(11);
export const password = composeValidators(required, minLength(6));
export const confirmedPassword = composeValidators(
  required,
  sameAs('password'),
  minLength(6),
);
export const confirmedNewPassword = composeValidators(
  required,
  sameAs('newPassword'),
  minLength(6),
);

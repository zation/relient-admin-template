import { keys } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const MALE = 'MALE';
export const FEMALE = 'FEMALE';

export const textMap = {
  [MALE]: '男',
  [FEMALE]: '女',
};

export const genders = keys(textMap);
export const genderOptions = getOptions(textMap)();
export const getGenderText = getText(textMap)();

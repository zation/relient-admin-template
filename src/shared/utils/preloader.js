import { readAll as readAllAccount } from 'shared/actions/account';

export default (account, dispatch) => {
  if (!account) {
    return [];
  }
  return [
    dispatch(readAllAccount()),
  ];
};

import { readAll as readAllAccount } from 'shared/actions/account';
import { readAll as readAllRole } from 'shared/actions/role';
import { readAll as readAllPermission } from 'shared/actions/permission';

export default (account, dispatch) => {
  if (!account) {
    return [];
  }
  return [
    dispatch(readAllAccount()),
    dispatch(readAllRole()),
    dispatch(readAllPermission()),
  ];
};

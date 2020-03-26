import { useCallback } from 'react';
import { ACTIVE, INACTIVE } from 'shared/constants/normal-status';
import { Message } from 'antd';

export default ({ update }) => useCallback(async ({
  id,
  status,
}) => {
  await update({
    id,
    status: status === ACTIVE ? INACTIVE : ACTIVE,
  });
  Message.success('修改成功');
}, [update]);

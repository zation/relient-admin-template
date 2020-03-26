/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { useState } from 'react';
import { number } from 'prop-types';

const result = ({ height }) => {
  const [catchBuster, setCatchBuster] = useState('');

  return (
    <img
      height={height}
      src={`/api/captcha?${catchBuster}`}
      alt="captcha"
      onClick={() => setCatchBuster(new Date().toISOString())}
      style={{ cursor: 'pointer' }}
    />
  );
};

result.propTypes = {
  height: number,
};

result.displayName = __filename;

export default result;

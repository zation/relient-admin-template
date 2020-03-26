import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';

const actionType = actionTypeCreator('actions/resource');

export const UPLOAD_FILE = actionType('UPLOAD_FILE');

const upload = (url, data, options) => {
  const headers = {
    'content-type': 'multipart/form-data',
  };

  return {
    ...options,
    url,
    isUpload: true,
    headers,
    body: data,
  };
};

export const uploadFile = createAction(
  UPLOAD_FILE,
  ({ url }) => upload('/resource/file', url),
);

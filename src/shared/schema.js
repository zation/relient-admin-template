import { schema } from 'relient/reducers';

export const account = new schema.Entity('account');
export const role = new schema.Entity('role', {}, { idAttribute: 'key' });
export const permission = new schema.Entity('permission', {}, { idAttribute: 'key' });
export const order = new schema.Entity('order');

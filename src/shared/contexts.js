import { createContext } from 'react';
import { fromRenderProps } from 'recompose';
import { identity } from 'lodash/fp';

export const DomainContext = createContext({ apiDomain: '', cdnDomain: '' });

export const withDomainContext = fromRenderProps(DomainContext.Consumer, identity);

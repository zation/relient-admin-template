import React from 'react';
import { object, func, node, string } from 'prop-types';
import { Provider as ReactReduxProvider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { DomainContext, BaseUrlContext } from 'relient-admin/contexts';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment/moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const result = ({
  children,
  store,
  domainContext,
  insertCss,
  baseUrlContext,
}) => (
  <StyleContext.Provider value={{ insertCss }}>
    <ReactReduxProvider store={store}>
      <DomainContext.Provider value={domainContext}>
        <BaseUrlContext.Provider value={baseUrlContext}>
          <ConfigProvider locale={zhCN}>
            {children}
          </ConfigProvider>
        </BaseUrlContext.Provider>
      </DomainContext.Provider>
    </ReactReduxProvider>
  </StyleContext.Provider>
);

result.propTypes = {
  children: node,
  store: object.isRequired,
  domainContext: object.isRequired,
  insertCss: func.isRequired,
  baseUrlContext: string,
};

result.displayName = __filename;

export default result;

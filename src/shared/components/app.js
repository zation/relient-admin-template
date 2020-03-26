import React from 'react';
import { object, func, node } from 'prop-types';
import { Provider as ReactReduxProvider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { DomainContext } from 'shared/contexts';
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
}) => (
  <StyleContext.Provider value={{ insertCss }}>
    <ReactReduxProvider store={store}>
      <DomainContext.Provider value={domainContext}>
        <ConfigProvider locale={zhCN}>
          {children}
        </ConfigProvider>
      </DomainContext.Provider>
    </ReactReduxProvider>
  </StyleContext.Provider>
);

result.propTypes = {
  children: node,
  store: object.isRequired,
  domainContext: object.isRequired,
  insertCss: func.isRequired,
};

result.displayName = __filename;

export default result;

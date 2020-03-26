import React, { useCallback } from 'react';
import { string, node, bool } from 'prop-types';
import { Layout, Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from 'shared/actions/auth';
import useStyles from 'isomorphic-style-loader/useStyles';
import Link from 'shared/components/link';
import { last } from 'lodash/fp';
import { getFeatureBy } from 'shared/constants/features';
import Sider from './sider';
import antDesignStyle from './antd_.less';
import s from './layout.less';
import Footer from './footer';
import Header from './header';
import selector from './layout-selector';

const { Content } = Layout;

const result = ({
  children,
  className,
  title,
  subTitle,
  multipleCard = false,
}) => {
  useStyles(antDesignStyle, s);
  const { features, currentAccount, selectedFeatureKeys } = useSelector(selector);
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutAction());
    global.document.location.replace('/auth/login');
  }, [logoutAction]);

  return (
    <Layout>
      {currentAccount && (
        <Header
          email={currentAccount.email}
          username={currentAccount.username}
          logout={logout}
        />
      )}
      <Layout hasSider>
        <Sider
          selectedFeatureKeys={selectedFeatureKeys}
          features={features}
        />
        <Content style={{ margin: '24px 24px 0', height: '100%' }}>
          <div className={s.Title}>
            <h1 className={s.TitleText}>
              {title || (subTitle
                ? <Link feature={last(selectedFeatureKeys)} />
                : getFeatureBy('text')(last(selectedFeatureKeys)))}
            </h1>
            {subTitle && <div className={s.Separator}>/</div>}
            <div className={s.SubTitle}>{subTitle}</div>
          </div>
          <div className={className}>
            {multipleCard ? children : (
              <Card bordered={false}>
                {children}
              </Card>
            )}
          </div>
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
};

result.propTypes = {
  children: node,
  className: string,
  title: node,
  subTitle: string,
  multipleCard: bool,
};

result.displayName = __filename;

export default result;

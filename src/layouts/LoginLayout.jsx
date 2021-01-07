import {connect} from 'dva';
import React from 'react';
import DocumentTitle from 'react-document-title';
import {formatMessage} from 'umi-plugin-react/locale';
import {getPageTitle, getMenuData} from '@ant-design/pro-layout';

const LoginLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const {routes = []} = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const {breadcrumb} = getMenuData(routes, props);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div>
        {children}
      </div>
    </DocumentTitle>
  );
};

export default connect(({settings}) => ({...settings}))(LoginLayout);

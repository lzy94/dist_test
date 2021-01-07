import React, { PureComponent } from 'react';
import { Result } from 'antd';


export default class Index extends PureComponent {
  render() {
    return <div style={{ textAlign: 'center', paddingTop: 100 }}><Result
      status="404"
      title="404"
      subTitle="模块功能开发中······"
    />
    </div>;
  }
}

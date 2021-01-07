import React, { PureComponent } from 'react';
import * as $ from 'jquery';
import { Card } from 'antd';
import { Redirect } from 'umi';
import 'orgchart';
import 'orgchart/dist/css/jquery.orgchart.css';
import 'font-awesome/css/font-awesome.css';
import dataScource from './data';
import { checkAuth } from '@/utils/utils';
import publicCss from '../../../style/public.less';

const authority = ['/lawenfor/control'];

class Control extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    this.orgTree = React.createRef();
  }

  componentDidMount() {
    const options = {
      data: dataScource, // 数据源
      depth: 20,
      nodeContent: 'title',
      createNode: () => this.addClick, // 当渲染节点时添加点击事件
      toggleSiblingsResp: false, // 允许用户收缩展开兄弟节点
      // 'visibleLevel': 2, // 默认展开两级
    };
    $(this.orgTree.current).orgchart(options);
  }

  addClick = () => {
    console.log('----------');
  };

  render() {
    return (
      <Card bordered={false} style={{ minHeight: 'calc(100vh - 180px)' }}>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <div style={{ textAlign: 'center', fontSize: 18, paddingBottom: 20 }}>
          {/* 江油市交通运输局路政管理大队 */}
          安州区综合行政执法局
        </div>
        <div className={publicCss.orgchatMain} style={{ minHeight: '70vh' }} ref={this.orgTree} />
      </Card>
    );
  }
}

export default Control;

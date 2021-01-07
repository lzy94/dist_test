import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { GridContent } from '@ant-design/pro-layout';
import { Card, Radio } from 'antd';
import { Redirect } from 'umi';
import FirstInspection from './components/firstInspection';
import Recheck from './components/recheck';
import SignAndApprove from './components/signAndApprove';
import SignedAndApproved from './components/signedAndApproved';
import { checkAuth, getLocalStorage, returnLevelThree } from '@/utils/utils';

const RadioGroup = Radio.Group;

const authority = ['/lawment/mobile'];

@connect(({ Mobile, loading }) => ({
  Mobile,
  loading: loading.models.Mobile,
}))
/* eslint react/no-multi-comp:0 */
@connect(({}) => ({}))
class TableList extends PureComponent {
  state = {
    tabKey: '',
    radioButtonList: '',
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const radioButtonList = returnLevelThree(this.props.match.url);
    this.setState({
      radioButtonList,
      tabKey: radioButtonList.length ? radioButtonList[0].path : '',
    });
  }

  tabChange = e => {
    this.setState({ tabKey: e.target.value });
  };

  renderTitle = () => {
    const { tabKey, radioButtonList } = this.state;
    if (!tabKey) return;
    // eslint-disable-next-line consistent-return
    return (
      <div style={{ clear: 'both' }}>
        <span style={{ display: 'inline-block', lineHeight: '32px' }}>流动执法</span>
        <RadioGroup
          defaultValue={tabKey}
          style={{ float: 'right' }}
          buttonStyle="solid"
          onChange={this.tabChange}
        >
          {radioButtonList.length
            ? radioButtonList.map(item => (
                <Radio.Button key={item.path} value={item.path}>
                  {item.name}
                </Radio.Button>
              ))
            : null}
        </RadioGroup>
      </div>
    );
  };

  renderChildrenByTabKey = tabKey => {
    let template = '';
    const organId = getLocalStorage('organId').toString();
    switch (tabKey) {
      case '/traffic/lawment/mobile/check':
        template = <FirstInspection organId={organId} />; // 案件初审
        break;
      case '/traffic/lawment/mobile/casehand':
        template = <Recheck organId={organId} />; // 案件复审
        break;
      case '/traffic/lawment/mobile/archive':
        template = <SignAndApprove organId={organId} />; // 案件签批
        break;
      case '/traffic/lawment/mobile/caseArchive':
        template = <SignedAndApproved organId={organId} />; // 已归档
        break;
      default:
        template = null;
    }
    return template;
  };

  render() {
    const { tabKey } = this.state;
    return (
      <GridContent>
        {checkAuth(authority[0]) ? (
          <Card bordered={false} title={this.renderTitle()}>
            {this.renderChildrenByTabKey(tabKey)}
          </Card>
        ) : (
          <Redirect to="/exception/403" />
        )}
      </GridContent>
    );
  }
}

export default TableList;

import { Card, Radio, Empty, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { checkAuth, returnLevelThree } from '@/utils/utils';
import Wzsh from './components/wzsh';
import CaseHandling from './components/caseHandling';
import Archive from './components/Archive';
import FilingOfFiles from './components/filingOfFiles';
import InvalidData from './components/invalidData';
import ExemptionPunish from './components/exemptionPunish';

const RadioGroup = Radio.Group;

const authority = ['/lawment/dynamic'];

@connect(({ user, system }) => ({
  system,
  currentUser: user.currentUser,
}))
class Center extends PureComponent {
  state = {
    tabKey: '',
    siteList: [],
    radioButtonList: [],
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const radioButtonList = returnLevelThree(this.props.match.url);
    this.setState({
      radioButtonList,
      tabKey: radioButtonList.length ? radioButtonList[0].path : '',
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType: 1,
      },
      callback: res => {
        if (res.length) {
          const siteList = res.map((item, index) => {
            const key = Object.keys(item);
            return {
              index: index + 1,
              code: key[0],
              name: item[key[0]],
              direction: [item[key[1]], item[key[2]]],
            };
          });
          this.setState({ siteList });
        } else {
          Modal.error({
            title: '提示',
            content: '您没有绑定站点！！！',
          });
        }
      },
    });
  }

  tabChange = e => {
    this.setState({ tabKey: e.target.value });
  };

  renderChildrenByTabKey = (tabKey, siteList) => {
    let template = '';
    switch (tabKey) {
      case '/traffic/lawment/dynamic/check':
        template = <Wzsh siteList={siteList} />; // 违章审核
        break;
      case '/traffic/lawment/dynamic/casehand':
        template = <CaseHandling siteList={siteList} />; // 案件办理
        break;
      case '/traffic/lawment/dynamic/archive':
        template = <Archive siteList={siteList} />; // 案件签批
        break;
      case '/traffic/lawment/dynamic/filepige':
        template = <FilingOfFiles siteList={siteList} />; // 案卷归档
        break;
      case '/traffic/lawment/dynamic/invalid':
        template = <InvalidData siteList={siteList} />; // 无效数据
        break;
      case '/traffic/lawment/dynamic/penalty':
        template = <ExemptionPunish siteList={siteList} />; // 免处罚数据
        break;
      default:
        template = null;
    }
    return template;
  };

  renderTitle = () => {
    const { tabKey, radioButtonList } = this.state;
    if (!tabKey) return;
    // eslint-disable-next-line consistent-return
    return (
      <div style={{ clear: 'both' }}>
        <span style={{ display: 'inline-block', lineHeight: '32px' }}>动态执法</span>
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

  render() {
    const { tabKey, siteList } = this.state;
    return (
      <GridContent>
        {checkAuth(authority[0]) ? (
          <Card bordered={false} title={this.renderTitle()}>
            {siteList.length ? (
              this.renderChildrenByTabKey(tabKey, siteList)
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        ) : (
          <Redirect to="/exception/403" />
        )}
      </GridContent>
    );
  }
}

export default Center;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { checkAuth, returnLevelThree } from '@/utils/utils';
import { GridContent } from '@ant-design/pro-layout';
import { Card, Empty, Modal, Radio } from 'antd';
import { Redirect } from 'umi';
import FirstInspection from './components/FirstInspection';
import Recheck from './components/Recheck';
import SignAndApprove from './components/SignAndApprove';
import SignedAndApproved from './components/SignedAndApproved';
import AbandonedData from './components/AbandonedData';

const RadioGroup = Radio.Group;

const authority = ['/lawment/static'];

/* eslint react/no-multi-comp:0 */
@connect(({ system }) => ({ system }))
class TableList extends PureComponent {
  state = {
    tabKey: '',
    siteList: [],
    radioButtonList: '',
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
        siteType: 2,
      },
      callback: res => {
        if (res.length) {
          const siteList = res.map(item => {
            const key = Object.keys(item);
            return {
              code: key[0],
              name: item[key[0]],
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

  renderTitle = () => {
    const { tabKey, radioButtonList } = this.state;
    if (!tabKey) return;
    // eslint-disable-next-line consistent-return
    return (
      <div style={{ clear: 'both' }}>
        <span style={{ display: 'inline-block', lineHeight: '32px' }}>静态执法</span>
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

  renderChildrenByTabKey = (tabKey, siteList) => {
    let template = '';
    switch (tabKey) {
      case '/traffic/lawment/static/check':
        template = <FirstInspection siteList={siteList} />; // 案件初审
        break;
      case '/traffic/lawment/static/casehand':
        template = <Recheck siteList={siteList} />; // 案件复审
        break;
      case '/traffic/lawment/static/archive':
        template = <SignAndApprove siteList={siteList} />; // 案件签批
        break;
      case '/traffic/lawment/static/caseArchive':
        template = <SignedAndApproved siteList={siteList} />; // 已归档
        break;
      case '/traffic/lawment/static/invalid':
        template = <AbandonedData siteList={siteList} />; // 作废数据
        break;
      default:
        template = null;
    }
    return template;
  };

  render() {
    const { tabKey, siteList } = this.state;
    return (
      <GridContent>
        {checkAuth(authority[0]) ? (
          <Card bordered={false} title={this.renderTitle()}>
            {JSON.stringify(siteList) !== '[]' ? (
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

export default TableList;

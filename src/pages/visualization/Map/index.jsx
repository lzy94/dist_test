import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Map from '../components/map/index';
import echarts from 'echarts';
import { getLocalStorage } from '@/utils/utils';

/**
 * @description 地图数据处理
 * @export
 * @class MyMap
 * @extends {PureComponent}
 */
@connect(({ user, BigScreen, loading }) => ({
  BigScreen,
  loading: loading.models.BigScreen,
  currentUser: user.currentUser,
}))
export default class MyMap extends PureComponent {
  constructor(props) {
    super(props);
    this.organCode = getLocalStorage('organId') || 51;
  }

  state = {
    siteList: [],
  };

  componentDidMount() {
    const area = this.getArea();
    echarts.registerMap('areaMap', area); // 地图注册
    this.getSiteList();
  }

  /**
   * @description 根据用户地区 显示相应的地图 ( 省，市，县区 )
   */
  getArea = () => {
    const fileName = `${this.organCode}.json`;
    return require(`@/assets/area/${fileName}`);
  };

  /**
   * @description 获取地图站点列表
   */
  getSiteList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BigScreen/siteList',
      payload: { organCode: this.organCode },
      callback: res => {
        this.formDataSiteList(res);
      },
    });
  };

  /**
   * @description 格式化站点数据
   * @param {*} list
   */
  formDataSiteList = list => {
    // 站点列表(动态，静态)
    const siteList = list.siteList.map(item => ({
      type: item.TYPE,
      name: item.SITE_NAME,
      value: [parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE)],
    }));

    // 源头企业
    const companyList = list.companyList.map(item => ({
      name: item.COMPANY_NAME,
      value: [parseFloat(item.LONGITUDE || 0), parseFloat(item.LATITUDE || 0)],
    }));

    // 动态站
    const dySite = siteList.filter(item => item.type === '1');
    // 静态站
    const staticSite = siteList.filter(item => item.type === '2');

    this.setState({ siteList: [dySite, staticSite, companyList] });
  };

  render() {
    return <Map data={this.state.siteList} />;
  }
}

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Select, Tooltip, Tag, Empty, message } from 'antd';
import { InfoWindow, Polyline } from 'react-amap';

import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';

import BaseMap from '@/pages/conserve/Component/BaseMap';
import MyPie from './MyPie';

import { getRandomColor } from '@/utils/utils';
import styles from './index.less';
import png_1 from '@/assets/conserve/market/1.png';
import png_2 from '@/assets/conserve/market/2.png';
import png_3 from '@/assets/conserve/market/3.png';
import png_4 from '@/assets/conserve/market/4.png';

const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@connect(({ marketCompanyGIS, loading }) => ({
  marketCompanyGIS,
  loading: loading.models.marketCompanyGIS,
}))
class Company extends PureComponent {
  constructor(props) {
    super(props);
    this.mapInstance = null;
  }

  state = {
    detail: [],
    colors: [],
    list: [],
    focusList: [],
    roadId: '',
    companyIndex: 0,
    roadInfoVisible: false,
    roadInfoLngLat: {},
    roadInfoMsg: {},
    center: null,
  };

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {
    if (this.mapInstance) {
      this.mapInstance.destroy();
    }
  }

  getDetail = e => {
    this.setState({ roadId: e });
    this.getCompanyInfo(e);
  };

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketCompanyGIS/fetch',
      callback: list => {
        const len = list.length;
        if (len) {
          const colors = [];
          for (let i = 0; i < len; i += 1) {
            colors.push(`#${getRandomColor()}`);
          }
          const focusList = list.map(item => (item.focus ? item : null)).filter(item => item);
          const roadId = list[0].id;
          this.setState(
            {
              colors,
              list,
              focusList,
              roadId,
            },
            () => this.getCompanyInfo(roadId),
          );
        }
      },
    });
  };

  getCompanyInfo = id => {
    const { dispatch } = this.props;
    const { list } = this.state;
    dispatch({
      type: 'marketCompanyGIS/companyInfo',
      payload: id,
      callback: detail => {
        if (!detail.length) {
          message.error('暂无数据');
        }
        this.setState({ detail }, () =>
          setTimeout(() => {
            let item = {};
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === id) {
                item = list[i];
                break;
              }
            }
            const center = item.startlongla ? item.startlongla.split(',') : null;
            this.setState({
              center: center
                ? {
                    longitude: center[0],
                    latitude: center[1],
                  }
                : null,
            });

            const swiper = new Swiper(
              '.swiper-container',
              {
                slidesPerView: 2,
                spaceBetween: 10,
                pagination: {
                  el: '.swiper-pagination',
                  clickable: true,
                },
              },
              500,
            );
          }),
        );
      },
    });
  };

  /**
   * @description 设置线路窗口值
   * @param roadInfoVisible
   * @param roadInfoMsg
   * @param roadInfoLngLat
   */
  setRoadInfoWindow = (roadInfoVisible = false, roadInfoMsg = {}, roadInfoLngLat = null) => {
    this.setState({
      roadInfoVisible,
      roadInfoMsg,
      roadInfoLngLat,
    });
  };

  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
      },
    };
  };

  /**
   * @description 路线事件
   * @returns {{mouseout: mouseout, click: click}}
   */
  polylineEvent = () => {
    return {
      click: e => {
        const info = e.target.getExtData();
        const lngLat = e.lnglat;
        this.setRoadInfoWindow(true, info, {
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        });
      },
      mouseout: e => {
        this.setRoadInfoWindow();
      },
    };
  };

  /**
   * @description 绘制路线
   * @returns {unknown[]|null}
   */
  renderPolyLine = () => {
    const { list, roadId, colors } = this.state;
    if (!list.length) return null;
    let item = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === roadId) {
        item = list[i];
        break;
      }
    }

    return (
      <Polyline
        style={{
          isOutline: true,
          outlineColor: '#000',
          borderWeight: 2,
          strokeWeight: 6,
          strokeColor: `${colors[0]}`,
          lineJoin: 'round',
          showDir: true,
          extData: {
            ...item,
          },
        }}
        key="Polyline"
        events={this.polylineEvent()}
        path={JSON.parse(item.longitudeandlatitude || '[]')}
      />
    );

    // const { list, colors } = this.state;
    // if (!list.length) return null;
    // return list.map((item, i) => <Polyline
    //   style={{
    //     isOutline: true,
    //     outlineColor: '#000',
    //     borderWeight: 2,
    //     strokeWeight: 6,
    //     strokeColor: `${colors[i]}`,
    //     lineJoin: 'round',
    //     showDir: true,
    //     extData: {
    //       ...item,
    //     },
    //   }}
    //   key={i}
    //   path={JSON.parse(item.longitudeandlatitude)}
    //   events={this.polylineEvent()}
    // />);
  };

  /**
   * @description 公司标签
   */
  renderTag = tag => {
    if (!tag) return null;
    const tags = tag.split(',').filter(item => item);
    return tags.map((item, i) => (
      <Tag color="#5176FD" key={i}>
        {item}
      </Tag>
    ));
  };

  /**
   * @description 公司统计
   */
  renderCompanyCountVo = () => {
    const { companyIndex, detail } = this.state;
    if (!detail.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    const companyCountVo = detail[companyIndex].companyCountVo;
    const completionList = companyCountVo.completion;
    let JD = '0';
    for (let i = 0; i < completionList.length; i++) {
      if (completionList[i].QWE === 'completed') {
        JD = completionList[i].TAGE.replace('%', '');
        break;
      }
    }

    return (
      <>
        <h3 className={styles.baseTitle}>
          <Tooltip title={detail[companyIndex].companyName}>
            {detail[companyIndex].companyName}
          </Tooltip>
        </h3>
        <ul className={styles.baseList}>
          <li>
            <img src={png_1} />
            <div className={styles.listContent}>
              <h3>
                {companyCountVo.ordersCount}
                <small>次</small>
              </h3>
              <p>维修次数</p>
            </div>
          </li>
          <li>
            <img src={png_2} />
            <div className={styles.listContent}>
              <h3>
                {JD}
                <small>%</small>
              </h3>
              <p>完成进度</p>
            </div>
          </li>
          <li>
            <img src={png_3} />
            <div className={styles.listContent}>
              <h3>
                {100 - companyCountVo.score}
                <small>分</small>
              </h3>
              <p>评审总分</p>
            </div>
          </li>
          <li>
            <img src={png_4} />
            <div className={styles.listContent}>
              <h3>
                {companyCountVo.roadCount}
                <small>条</small>
              </h3>
              <p>养护路段</p>
            </div>
          </li>
        </ul>
      </>
    );
  };

  renderRoadConserveExamine = () => {
    const { companyIndex, detail } = this.state;
    if (!detail.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    const roadConserveExamine = detail[companyIndex].roadConserveExamine;
    if (!roadConserveExamine.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return roadConserveExamine.map((item, i) => (
      <div key={i} className={styles.scoreList}>
        <p>扣分：{item.delScore}</p>
        <Tooltip title={item.reson}>
          <p>扣分原因：{item.reson}</p>
        </Tooltip>
      </div>
    ));
  };

  /**
   * @description 统计图
   * @returns {*}
   */
  renderPie = () => {
    const { companyIndex, detail } = this.state;
    if (!detail.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    const { completion } = detail[companyIndex];
    if (!completion.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return <MyPie data={completion} />;
  };

  render() {
    const { loading } = this.props;
    const {
      center,
      detail,
      list,
      focusList,
      roadId,
      roadInfoLngLat,
      roadInfoMsg,
      roadInfoVisible,
    } = this.state;

    // 公路信息窗口
    const roadInfoWindowDom = (
      <InfoWindow
        position={roadInfoLngLat}
        visible={roadInfoVisible}
        isCustom
        showShadow
        key="roadInfoWindowDom"
      >
        <p>公路名称：{roadInfoMsg.roadName}</p>
        <p>公路编号：{roadInfoMsg.roadCode}</p>
        <p>里程：{roadInfoMsg.roadMileage} km</p>
        <p>起点：{roadInfoMsg.startAddr}</p>
        <p>终点：{roadInfoMsg.endAddr}</p>
      </InfoWindow>
    );

    return (
      <div
        style={{
          height: 'calc(100vh - 140px)',
          margin: '-20px -20px -20px -20px',
          background: '#fff',
          position: 'relative',
        }}
      >
        <BaseMap
          center={center}
          amapEvents={this.amapEvents()}
          children={[this.renderPolyLine(), roadInfoWindowDom]}
        />

        <div className={styles.roadMain}>
          <Select
            value={roadId}
            onChange={this.getDetail}
            placeholder="请选择路线"
            style={{ width: '100%' }}
            dropdownMatchSelectWidth={false}
          >
            {list.map((item, i) => (
              <Option key={i} value={item.id}>{`${item.roadCode} - ${item.roadName}`}</Option>
            ))}
          </Select>
          <h3>重点路段</h3>
          <div className={styles.roadList}>
            {focusList.length ? (
              focusList.map((item, i) => (
                <Tooltip key={i} title={`${item.roadCode} - ${item.roadName}`}>
                  {' '}
                  <span
                    onClick={() => this.getDetail(item.id)}
                    className={styles.roadTag + ' ' + (roadId === item.id ? styles.active : null)}
                    title={`${item.roadCode} - ${item.roadName}`}
                  >
                    {item.roadCode}
                  </span>
                </Tooltip>
              ))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>

        <div className={styles.swiperMain}>
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {detail.length
                ? detail.map((item, i) => (
                    <div
                      style={{ padding: 15 }}
                      onClick={() => this.setState({ companyIndex: i })}
                      key={i}
                      className="swiper-slide"
                    >
                      <div className={styles.swiperList}>
                        <h3>
                          <Tooltip title={item.companyName}>{item.companyName}</Tooltip>
                        </h3>
                        <div>{this.renderTag(item.conserveCategoryName)}</div>
                        <p>
                          <Tooltip title={item.companyDesc}>简介：{item.companyDesc}</Tooltip>
                        </p>
                      </div>
                    </div>
                  ))
                : null}
            </div>
            <div className="swiper-pagination">&nbsp;</div>
          </div>
        </div>

        <div className={styles.detailPanel}>
          <h3 className={styles.title}>
            <span>&nbsp;</span>养护企业信息
          </h3>
          <div className={styles.baseMsg} style={{ height: 202 }}>
            <Spin spinning={loading}>{this.renderCompanyCountVo()}</Spin>
          </div>
          <div className={styles.baseMsg}>
            <h3 className={styles.baseTitle}>评审详情</h3>
            <div style={{ height: 200, overflowY: 'auto' }}>
              <Spin spinning={loading}>{this.renderRoadConserveExamine()}</Spin>
            </div>
          </div>
          <div className={styles.baseMsg}>
            <h3 className={styles.baseTitle}>养护统计</h3>
            <Spin spinning={loading}>{this.renderPie()}</Spin>
          </div>
        </div>
      </div>
    );
  }
}

export default Company;

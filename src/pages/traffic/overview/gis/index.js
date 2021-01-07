import React, { PureComponent, Component } from 'react';
import {
  Statistic,
  Form,
  Icon,
  Carousel,
  Modal,
  Radio,
  Tooltip,
  Tree,
  Card,
  Descriptions,
} from 'antd';
import { Map, Markers } from 'react-amap';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import Zmage from 'react-zmage';
import { Redirect } from 'umi';
import mapCss from '../../../style/map.less';
import { getLocalStorage, imgUrl, checkAuth } from '@/utils/utils';

import dyIcon from '@/assets/dy-icon.png';
import staticIcon from '@/assets/static-icon.png';
import notImg from '@/assets/notImg.png';
import sourceIcon from '@/assets/source-icon.png';

import mapImg from '@/assets/map.png';

const RadioGroup = Radio.Group;
const { TreeNode } = Tree;
const { Countdown } = Statistic;

const authority = ['/overview/gis'];

let [map, districtExplorer, currentAreaNode] = [null, null, null];

class UIMarker extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    map = this.props.__map__;
    const organId = this.getOrganId();
    this.loadUI(organId);
  }

  getOrganId = () => {
    let organId = localStorage.getItem('organId') || '510000';
    const len = 6 - organId.length;

    for (let i = 0; i < len; i += 1) {
      organId += '0';
    }
    return organId;
  };

  /**
   * 切换区域
   * @param areaCode
   */
  switchAreaNode = areaCode => {
    if (currentAreaNode && '' + currentAreaNode.getAdcode() === '' + areaCode) {
      return;
    }
    districtExplorer.loadAreaNode(areaCode, (error, areaNode) => {
      currentAreaNode = window.currentAreaNode = areaNode;
      districtExplorer.setAreaNodesForLocating([currentAreaNode]);
      districtExplorer.setHoverFeature(null);
      this.renderAreaPolygons(areaCode);
    });
  };

  loadUI = organId => {
    window.AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
      districtExplorer = new DistrictExplorer({
        map,
      });
      this.renderAreaPolygons(organId);
    });
  };

  /**
   * 绘制区域地图
   * @param areaCode
   */
  renderAreaPolygons = (areaCode = 510000) => {
    districtExplorer.loadAreaNode(areaCode, (error, areaNode) => {
      // 更新地图视野
      if (!areaNode && areaNode === undefined) return;
      map.setBounds(areaNode.getBounds(), null, null, true);
      // 清除已有的绘制内容
      districtExplorer.clearFeaturePolygons();
      // 绘制父区域
      districtExplorer.renderParentFeature(areaNode, {
        cursor: 'default',
        bubble: true,
        strokeColor: '#000', // 线颜色
        strokeOpacity: 0.5, // 线透明度
        strokeWeight: 1, // 线宽
        fillColor: '#fff', // 填充色
        fillOpacity: 0.5, // 填充透明度
      });
    });
  };

  render() {
    return <></>;
  }
}

/**
 * 站点详情
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const ModalMsg = Form.create()(props => {
  const {
    data,
    modalVisible,
    handleModalVisible,
    onFinishCount,
    finishCountType,
    handleFinishCountVisible,
    mySiteCarousel,
    next,
    prev,
  } = props;
  const { siteInfo } = data;
  const count = data.count[0];
  const verificationDate = new Date(siteInfo.verificationDate).getTime();
  if (verificationDate) {
    if (verificationDate < new Date().getTime()) {
      handleFinishCountVisible(true);
    }
  }

  const onFinish = () => {
    onFinishCount();
  };

  const title = () => {
    return (
      <div style={{ paddingRight: 30, overflow: 'hidden' }}>
        <span className={mapCss.title}>{siteInfo.siteName}</span>
        {!verificationDate ? null : finishCountType ? (
          <span className={mapCss.title} style={{ color: 'red', float: 'right' }}>
            已到检定时间
          </span>
        ) : (
          <Countdown
            onFinish={onFinish}
            valueStyle={{ fontSize: 15, lineHeight: 1 }}
            style={{ float: 'right' }}
            title="下次检定时间"
            value={verificationDate}
            format="D 天 H 时 m 分 s 秒 SSS"
          />
        )}
      </div>
    );
  };
  const siteImg = siteInfo.siteImg ? siteInfo.siteImg.split(',') : [];
  const siteImgs = siteImg.map(item => ({
    src: imgUrl + item,
    alt: siteInfo.siteName,
  }));
  return (
    <Modal
      destroyOnClose
      title={title()}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
      bodyStyle={{ padding: 0 }}
      wrapClassName={mapCss.modalMain}
    >
      <div className={mapCss.myCarousel}>
        <Icon
          onClick={prev}
          className={`${mapCss.pos} ${mapCss.prev}`}
          type="left-circle"
          theme="filled"
        />
        <Icon
          onClick={next}
          className={`${mapCss.pos} ${mapCss.next}`}
          type="right-circle"
          theme="filled"
        />
        <Carousel ref={mySiteCarousel} autoplay>
          {siteImg.length ? (
            siteImgs.map((item, i) => (
              <Zmage
                key={item.src}
                backdrop="rgba(255,255,255,.3)"
                defaultPage={i}
                style={{ height: 250 }}
                src={item.src}
                set={siteImgs}
              />
            ))
          ) : (
            <img className={mapCss.notImg} src={notImg} alt="" />
          )}
        </Carousel>
      </div>
      <div className={mapCss.address}>
        <Icon type="environment" style={{ marginRight: 5 }} />
        {siteInfo.address}
      </div>
      <Card>
        <Card.Grid style={{ width: '33.3333%' }}>
          <Statistic title="今日检测数" value={count.TOTAL} valueStyle={{ color: '#0a67fb' }} />
        </Card.Grid>
        <Card.Grid style={{ width: '33.3333%' }}>
          <Statistic
            title="今日超限数"
            value={count.OVERLOADTOTAL}
            valueStyle={{ color: '#ff4343' }}
          />
        </Card.Grid>
        <Card.Grid style={{ width: '33.3333%' }}>
          <Statistic
            title="今日超限率"
            value={((count.OVERLOADTOTAL / count.TOTAL || 0) * 100).toFixed(2)}
            precision={2}
            valueStyle={{ color: '#d338ff' }}
            suffix="%"
          />
        </Card.Grid>
      </Card>
    </Modal>
  );
});

/**
 * 源头企业详情
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const SourceModal = Form.create()(props => {
  const { data, modalVisible, handleModalVisible, mySourceCarousel, prev, next } = props;

  const siteImg = data.companyImg ? data.companyImg.split(',') : [];
  const siteImgs = siteImg.map(item => ({
    src: imgUrl + item,
    alt: data.companyName,
  }));
  return (
    <Modal
      destroyOnClose
      title={<div style={{ padding: '8px 0' }}>{data.companyName}</div>}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
      bodyStyle={{ padding: 0 }}
      wrapClassName={mapCss.modalMain}
    >
      <div className={mapCss.myCarousel}>
        <Icon
          onClick={prev}
          className={`${mapCss.pos} ${mapCss.prev}`}
          type="left-circle"
          theme="filled"
        />
        <Icon
          onClick={next}
          className={`${mapCss.pos} ${mapCss.next}`}
          type="right-circle"
          theme="filled"
        />
        <Carousel ref={mySourceCarousel} autoplay>
          {siteImg.length ? (
            siteImgs.map((item, i) => (
              <Zmage
                key={item.src}
                backdrop="rgba(255,255,255,.3)"
                defaultPage={i}
                style={{ height: 250 }}
                src={item.src}
                set={siteImgs}
              />
            ))
          ) : (
            <img className={mapCss.notImg} src={notImg} alt="" />
          )}
        </Carousel>
      </div>
      <div className={mapCss.address}>
        <Icon type="environment" style={{ marginRight: 5 }} />
        {data.address}
      </div>
      <Card>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="年吞吐量">{data.throughput}</Descriptions.Item>
          <Descriptions.Item label="监管人">{data.supervisionMan}</Descriptions.Item>
          <Descriptions.Item label="监管人联系方式">{data.supervisionTel}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ TrafficApiV2Count, GisMap, loading }) => ({
  GisMap,
  loading: loading.models.GisMap,
  TrafficApiV2Count,
  apiV2Loading: loading.models.TrafficApiV2Count,
}))
class GisMap extends PureComponent {
  columns = [
    {
      title: '站名',
      dataIndex: 'siteName',
      render: val =>
        val.length > 7 ? <Tooltip title={val}>{`${val.substring(0, 7)}...`}</Tooltip> : val,
    },
    {
      title: '检测数',
      dataIndex: 'total',
    },
    {
      title: '超限数',
      dataIndex: 'overLoadTotal',
    },
    {
      title: '超限率(%)',
      dataIndex: 'overRate',
      render: val => `${parseFloat(val).toFixed(2)}`,
    },
  ];

  columns2 = [
    {
      title: '站名',
      dataIndex: 'siteName',
      render: val =>
        val.length > 7 ? <Tooltip title={val}>{`${val.substring(0, 7)}...`}</Tooltip> : val,
    },
    {
      title: '检测数',
      dataIndex: 'total',
    },
    {
      title: '超限数',
      dataIndex: 'overLoadTotal',
    },
    {
      title: '超限率(%)',
      dataIndex: 'rate',
      render: val => `${parseFloat(val * 100).toFixed(2)}`,
    },
  ];

  constructor(props) {
    super(props);
    this.myUIMarker = React.createRef();
    this.mySiteCarousel = React.createRef();
    this.mySourceCarousel = React.createRef();
    this.siteCodeList = [];
    this.sourceCodeList = [];
  }

  state = {
    sourceList: [],
    siteList: [],
    treeList: [],
    siteCodeLists: [],
    isRightClose: true,
    isLeftClose: true,
    infoVisible: false,
    sourceVisible: false,
    finishCountType: false,
    sourceData: {},
    siteData: {
      count: [{}],
      siteInfo: {},
    },
  };

  componentDidMount() {
    this.getDynamicOverLimitTop5();
    this.getStaticOverLimitTop5();
    setTimeout(() => {
      this.getAllSite();
    }, 500);
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    if (map) {
      map.destroy();
    }
  }

  /**
   * @description 动态TOp5
   * @param {*} params
   */
  getDynamicOverLimitTop5 = (params = 7) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/dynamicOverLimitTop5',
      payload: params,
    });
  };

  /**
   * @description 静态top5
   * @param {*} params
   */
  getStaticOverLimitTop5 = (params = 7) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'GisMap/staticOverLimitTop5',
      payload: {
        day: params,
      },
    });
  };

  getAllSite = () => {
    const organId = getLocalStorage('organId');
    const { dispatch } = this.props;
    dispatch({
      type: 'GisMap/allSite',
      payload: { cityCode: organId },
      callback: res => {
        const list = this.formatTree(res);
        this.setState({ treeList: list });
      },
    });
  };

  /**
   * 渲染树形
   */
  renderTree = () => {
    const { treeList } = this.state;
    return this.renderTreeNodes(treeList);
  };

  /**
   * 将数据处理为 nodes
   * @param list
   * @returns {*}
   */
  renderTreeNodes = list => {
    return list.map(item => {
      let icon = null;
      if (item.siteType === '1') {
        icon = {
          icon: <img style={{ width: 15 }} src={dyIcon} alt="" />,
        };
      } else if (item.siteType === '2') {
        icon = {
          icon: <img style={{ width: 15 }} src={staticIcon} alt="" />,
        };
      } else if (item.siteType === '3') {
        icon = {
          icon: <img style={{ width: 15 }} src={sourceIcon} alt="" />,
        };
      }
      if (item.children.length) {
        return (
          <TreeNode {...icon} title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...icon} {...item} key={item.key} />;
    });
  };

  /**
   * 处理数据
   * @param list
   * @returns {*}
   */
  formatTree = list => {
    return list.map(item => {
      return {
        title: item.areaName,
        key: item.code,
        siteType: 0,
        children: item.children.length
          ? this.formatTree(item.children)
              .concat(this.formatSite(item.siteList))
              .concat(this.formatSource(item.companyList))
          : [].concat(this.formatSite(item.siteList)).concat(this.formatSource(item.companyList)),
      };
    });
  };

  myIsNaN = value => typeof value === 'number' && !isNaN(value);

  formatSource = list => {
    return list.map(item => {
      if (this.sourceCodeList.indexOf(`${item.id}-3`)) {
        this.sourceCodeList.push(`${item.id}-3`);
        const { sourceList, siteCodeLists } = this.state;
        this.setState({
          sourceList: [
            {
              companyName: item.companyName,
              siteCode: `${item.id}-3`,
              siteType: '3',
              position: {
                // latitude: (item.latitude || 0) === 'undefined' ? 0 : item.latitude || 0,
                // longitude: (item.longitude || 0) === 'undefined' ? 0 : item.longitude || 0,
                latitude: this.myIsNaN(parseInt(item.latitude, 10)) ? item.latitude : 0,
                longitude: this.myIsNaN(parseInt(item.longitude, 10)) ? item.longitude : 0,
              },
            },
            ...sourceList,
          ],
          siteCodeLists: [`${item.id}-3`, ...siteCodeLists],
        });
        return {
          siteType: '3',
          title: item.companyName,
          key: `${item.id}-3`,
          children: [],
        };
      }
    });
  };

  /**
   * 处理站点  添加到树形图中
   * @param list
   * @returns {*}
   */
  formatSite = list => {
    return list.map(item => {
      if (this.siteCodeList.indexOf(`${item.siteCode}-${item.siteType}`) < 0) {
        const { siteList, siteCodeLists } = this.state;
        this.siteCodeList.push(`${item.siteCode}-${item.siteType}`);
        this.setState({
          siteList: [
            {
              siteName: item.siteName,
              siteCode: `${item.siteCode}-${item.siteType}`,
              siteType: item.siteType,
              position: {
                latitude: item.latitude || 0,
                longitude: item.longitude || 0,
              },
            },
            ...siteList,
          ],
          siteCodeLists: [`${item.siteCode}-${item.siteType}`, ...siteCodeLists],
        });
      }

      return {
        siteType: item.siteType,
        title: item.siteName,
        key: `${item.siteCode}-${item.siteType}`,
        children: [],
      };
    });
  };

  dyRadioChange = e => {
    this.getDynamicOverLimitTop5(e.target.value);
  };

  staticRadioChange = e => {
    this.getStaticOverLimitTop5(e.target.value);
  };

  handleSourceModalVisible = flag => {
    this.setState({ sourceVisible: !!flag });
    if (!flag) {
      this.setState({
        sourceData: {},
      });
    }
  };

  handleModalMsgVisible = flag => {
    this.setState({
      infoVisible: !!flag,
    });
    if (!flag) {
      this.handleFinishCountVisible();
      this.setState({
        siteData: {
          count: [{}],
          siteInfo: {},
        },
      });
    }
  };

  handleFinishCountVisible = flag => {
    this.setState({ finishCountType: !!flag });
  };

  getSiteAndCount = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'GisMap/siteAndCount',
      payload: {
        siteCode: params.split('-')[0],
      },
      callback: res => {
        this.handleModalMsgVisible(true);
        this.setState({ siteData: res });
      },
    });
  };

  getCompanyAndCount = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'GisMap/companyAndCount',
      payload: {
        id: params.split('-')[0],
      },
      callback: res => {
        this.handleSourceModalVisible(true);
        this.setState({ sourceData: res });
      },
    });
  };

  markerEvents = {
    click: (e, marker) => {
      const extData = marker.getExtData();
      this.getSiteAndCount(extData.siteCode);
    },
  };

  markerSourceEvents = {
    click: (e, marker) => {
      const extData = marker.getExtData();
      this.getCompanyAndCount(extData.siteCode);
    },
  };

  renderMarkerLayout = extData => {
    const style = { width: 25 };
    if (extData.siteType === '1') {
      return (
        <a href="javascript:void(0)" title={extData.siteName}>
          <img src={dyIcon} style={style} alt="" />
        </a>
      );
    }
    if (extData.siteType === '2') {
      return (
        <a href="javascript:void(0)" title={extData.siteName}>
          <img src={staticIcon} style={style} alt="" />
        </a>
      );
    }
    return (
      <a href="javascript:void(0)" title={extData.companyName}>
        <img src={sourceIcon} style={style} alt="" />
      </a>
    );
  };

  completionCode = areaCode => {
    let suffx = '';
    for (let i = 0; i < 6 - areaCode.length; i += 1) {
      suffx += '0';
    }
    return parseInt(areaCode + suffx, 10);
  };

  // 地区选择
  treeSelect = selectedKeys => {
    if (this.siteCodeList.indexOf(selectedKeys[0]) > -1) {
      this.getSiteAndCount(selectedKeys[0]);
    } else if (this.sourceCodeList.indexOf(selectedKeys[0]) > -1) {
      this.getCompanyAndCount(selectedKeys[0]);
    } else {
      if (selectedKeys.length) {
        this.myUIMarker.switchAreaNode(this.completionCode(selectedKeys[0]));
        this.setState({ isClickArea: true, areaCode: this.completionCode(selectedKeys[0]) });
      }
    }
  };

  onFinishCount = () => {
    Modal.warning({
      title: '提示',
      content: '已到检定时间',
    });
    this.handleFinishCountVisible(true);
  };

  sourcePrev = () => {
    this.mySourceCarousel.prev();
  };

  sourceNext = () => {
    this.mySourceCarousel.next();
  };

  sitePrev = () => {
    this.mySiteCarousel.prev();
  };

  siteNext = () => {
    this.mySiteCarousel.next();
  };

  render() {
    const {
      loading,
      apiV2Loading,
      GisMap: { staticData },
      TrafficApiV2Count: { dyTop5Data },
    } = this.props;
    const {
      isRightClose,
      isLeftClose,
      treeList,
      siteList,
      sourceList,
      infoVisible,
      siteData,
      siteCodeLists,
      finishCountType,
      sourceData,
      sourceVisible,
    } = this.state;
    const tabConfig = {
      tableAlert: false,
      selectedRows: 0,
      rowSelection: null,
      size: 'small',
      bordered: false,
      pagination: false,
      columns: this.columns,
    };

    const parentMethods = {
      data: siteData,
      handleModalVisible: this.handleModalMsgVisible,
      onFinishCount: this.onFinishCount,
      finishCountType,
      handleFinishCountVisible: this.handleFinishCountVisible,
      prev: this.sitePrev,
      next: this.siteNext,
    };

    const sourceMehtods = {
      data: sourceData,
      handleModalVisible: this.handleSourceModalVisible,
      prev: this.sourcePrev,
      next: this.sourceNext,
    };

    return (
      <div>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <div
          style={{
            height: 'calc(100vh - 140px)',
            margin: '-20px -20px -20px -20px',
            background: '#fff',
            position: 'relative',
          }}
        >
          {infoVisible && JSON.stringify(siteData.siteInfo) !== '{}' ? (
            <ModalMsg
              mySiteCarousel={el => (this.mySiteCarousel = el)}
              {...parentMethods}
              modalVisible={infoVisible}
            />
          ) : null}
          {sourceVisible && JSON.stringify(sourceData) ? (
            <SourceModal
              mySourceCarousel={el => (this.mySourceCarousel = el)}
              {...sourceMehtods}
              modalVisible={sourceVisible}
            />
          ) : null}
          <Map amapkey="33d3572b08475f40fbec1241868fcbb8" useAMapUI={true}>
            <UIMarker ref={el => (this.myUIMarker = el)} />
            {siteList.length ? (
              <Markers
                markers={siteList}
                events={this.markerEvents}
                render={this.renderMarkerLayout}
              />
            ) : null}
            {sourceList.length ? (
              <Markers
                markers={sourceList}
                events={this.markerSourceEvents}
                render={this.renderMarkerLayout}
              />
            ) : null}
          </Map>
          {/* <div className={mapCss.mapImg2} /> */}
          {/* <img src={mapImg} style={{ width: '100%', height: '100%' }} /> */}

          <div className={`${mapCss.mapLeft} ${isLeftClose ? '' : mapCss.onClose}`}>
            <div className={mapCss.treeList}>
              {treeList.length ? (
                <Tree
                  showLine
                  showIcon
                  defaultExpandedKeys={siteCodeLists}
                  onSelect={this.treeSelect}
                >
                  {this.renderTree()}
                </Tree>
              ) : null}
            </div>
            <div
              className={mapCss.leftClose}
              onClick={() => this.setState({ isLeftClose: !isLeftClose })}
            >
              {isLeftClose ? (
                <Icon className={mapCss.closeBtn} type="double-left" />
              ) : (
                <Icon className={mapCss.closeBtn} type="double-right" />
              )}
            </div>

            <div className={mapCss.printType}>
              <div className={mapCss.printTypeItem}>
                <img src={dyIcon} alt="" />
                动态站点
              </div>
              <div className={mapCss.printTypeItem}>
                <img src={staticIcon} alt="" />
                静态站点
              </div>
              <div className={mapCss.printTypeItem}>
                <img src={sourceIcon} alt="" />
                源头企业
              </div>
            </div>
          </div>
          <div
            className={mapCss.rightCloseBtn}
            onClick={() => this.setState({ isRightClose: !isRightClose })}
          >
            <div className={mapCss.rotate}>
              {isRightClose ? (
                <Icon className={mapCss.closeBtn} type="double-left" />
              ) : (
                <Icon className={mapCss.closeBtn} type="double-right" />
              )}
            </div>
          </div>
          <div className={`${mapCss.mapRight} ${isRightClose ? '' : mapCss.rightClose}`}>
            <div className={mapCss.rightList}>
              <div>
                <a href="javascript:void(0)" className={mapCss.rightTitle}>
                  动态检测TOP5
                </a>
                <RadioGroup
                  style={{ float: 'right' }}
                  defaultValue={7}
                  onChange={this.dyRadioChange}
                >
                  <Radio value={7}>7天</Radio>
                  <Radio value={30}>30天</Radio>
                  <Radio value={90}>90天</Radio>
                </RadioGroup>
                <div style={{ minHeight: 250, marginTop: 10 }} className={mapCss.tabHeadW}>
                  <StandardTable
                    {...tabConfig}
                    loading={apiV2Loading}
                    data={{ list: dyTop5Data }}
                  />
                </div>
              </div>
              <div>
                <a href="javascript:void(0)" className={mapCss.rightTitle}>
                  静态检测TOP5
                </a>
                <RadioGroup
                  style={{ float: 'right' }}
                  defaultValue={7}
                  onChange={this.staticRadioChange}
                >
                  <Radio value={7}>7天</Radio>
                  <Radio value={30}>30天</Radio>
                  <Radio value={90}>90天</Radio>
                </RadioGroup>
                <div style={{ minHeight: 250, marginTop: 10 }} className={mapCss.tabHeadW}>
                  <StandardTable
                    {...tabConfig}
                    loading={loading}
                    data={staticData}
                    columns={this.columns2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GisMap;

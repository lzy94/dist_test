import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Input,
  Pagination,
  Spin,
  message,
  Empty,
} from 'antd';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';
import CompanyModal from './Company';
import style from '../index.less';
import styles from '@/pages/style/style.less';
import notImg from '@/assets/notImg.png';
import moment from 'moment';

const FormItem = Form.Item;

const RenderDetail = Form.create()(props => {
  const { form, detail, save, renderImg, companyName, companyHandleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      save(fieldsValue);
    });
  };

  return (
    <div className={style.rightBody}>
      <div className={`${style.header} ${style.detail}`}>
        <h3>
          <span />
          详情信息
        </h3>
      </div>
      <div style={{ height: 610, overflowY: 'auto', paddingRight: 24 }}>
        <Form onSubmit={okHandle}>
          {Object.keys(detail).length ? (
            <div style={{ paddingLeft: 12 }}>
              <div style={{ overflow: 'hidden' }}>{renderImg()} </div>

              <FormItem label="所在位置" style={{ marginBottom: 0 }}>
                {form.getFieldDecorator('curingAddr', {
                  initialValue: detail.truobleAddr,
                })(<Input readOnly />)}
              </FormItem>
              <FormItem label="创建时间" style={{ marginBottom: 0 }}>
                {form.getFieldDecorator('createTime', {
                  initialValue: detail.createTime,
                })(<Input readOnly />)}
              </FormItem>
              <FormItem label="养护原因" style={{ marginBottom: 0 }}>
                {form.getFieldDecorator('curingContent', {
                  initialValue: detail.truobleContent,
                })(<Input />)}
              </FormItem>
              {detail.state === 1 && (
                <Fragment>
                  <FormItem label="养护企业" style={{ marginBottom: 0 }}>
                    {form.getFieldDecorator('companyName', {
                      initialValue: companyName,
                      rules: [{ required: true, message: '请选择养护企业！' }],
                    })(
                      <Input
                        readOnly
                        placeholder="请选择养护企业"
                        onClick={() => companyHandleModalVisible(true)}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="限定完成时间" style={{ marginBottom: 0 }}>
                    {form.getFieldDecorator('endTime', {
                      rules: [{ required: true, message: '请选择限定完成时间！' }],
                    })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
                  </FormItem>
                  <FormItem label="工作内容" style={{ marginBottom: 0 }}>
                    {form.getFieldDecorator('workContent', {
                      rules: [{ required: true, message: '请输入工作内容！' }],
                    })(<Input.TextArea autosize placeholder="请输入" />)}
                  </FormItem>
                  <Button style={{ margin: '10px 0 0 130px ' }} type="primary" htmlType="submit">
                    同意保养
                  </Button>
                </Fragment>
              )}
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ RoadWorkOrdes, ContingencyPlan, loading }) => ({
  RoadWorkOrdes,
  ContingencyPlan,
  loading: loading.models.ContingencyPlan,
}))
@Form.create()
class RoadProductionTroubleModal extends PureComponent {
  state = {
    companyName: '',
    companyId: '',
    detail: {},
    companyModalVisible: false,
    pageBean: { page: 1, pageSize: 6, showTotal: true },
  };

  componentDidMount() {
    this.getList({ pageBean: this.state.pageBean });
  }

  companyHandleModalVisible = flag => {
    this.setState({
      companyModalVisible: !!flag,
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ContingencyPlan/fetch',
      payload: params,
    });
  };

  renderState = state => {
    if (state === 1) {
      return <span className={`${style.state} ${style.stateOne}`}>未处理</span>;
    }
    if (state === 2) {
      return <span className={`${style.state} ${style.stateTow}`}>已处理</span>;
    }
    return '';
  };

  showImg = img => {
    if (img) {
      const imgs = img.split(',');
      return imgUrl + imgs[0];
    }
    return notImg;
  };

  handleStandardTableChange = (page, pageSize) => {
    const { formValues } = this.state;
    const params = {
      pageBean: {
        page,
        pageSize,
        showTotal: true,
      },
      querys: formValues,
    };
    this.getList(params);
  };

  listClick = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ContingencyPlan/detail',
      payload: data.id,
      callback: detail => {
        this.setState({ detail });
      },
    });
  };

  renderList = data => {
    if (!data.list.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

    return data.list.map((item, i) => (
      <li key={i} onClick={() => this.listClick(item)}>
        <img
          src={this.showImg(item.imgUrl)}
          alt=""
          onError={e => {
            e.target.onerror = null;
            e.target.src = notImg;
          }}
        />
        <div className={style.liContent}>
          <h3>{item.truobleAddr}</h3>
          <p className={style.pC}>{item.truobleContent}</p>
          <p>{item.createTime}</p>
        </div>
        {this.renderState(item.state)}
      </li>
    ));
  };

  renderImg = () => {
    const { detail } = this.state;
    const img = detail.imgUrl;
    if (img) {
      const imgs = img.split(',');
      // const imgs = ['', '', ''];
      return imgs.map((item, index) => (
        <div
          key={index}
          style={{
            overflow: 'hidden',
            width: 125,
            height: 125,
            float: 'left',
            marginRight: 10,
          }}
        >
          <Zmage
            backdrop="rgba(255,255,255,.3)"
            src={imgUrl + item}
            alt="图片"
            style={{
              width: '100%',
              height: '125px',
            }}
          />
        </div>
      ));
    }
    return '';
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { pageBean } = this.state;
      const values = {
        // ...fieldsValue,
        truobleContent: fieldsValue.name,
        // createTime: moment(fieldsValue.time).format('YYYY-MM-DD'),
      };
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      // this.setState({
      //   formValues: conditionFilter,
      // });
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.getList({ pageBean });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ float: 'right' }}>
        <Row>
          {/* <Col md={8} sm={24}> */}
          {/* <FormItem>
              {getFieldDecorator('time')(
                <DatePicker placeholder="养护时间" style={{ width: '100%' }} />,
              )}
            </FormItem> */}
          {/* </Col> */}
          <Col md={12} sm={24}>
            <FormItem>{getFieldDecorator('name')(<Input placeholder="养护名称" />)}</FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  selectDataCate = data => {
    this.setState({
      companyId: data.id,
      companyName: data.companyName,
    });
  };

  changeState = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ContingencyPlan/change',
      payload: { id },
      callback: () => {
        message.success('下发成功');
        this.getList({ pageBean: this.state.pageBean });
      },
    });
  };

  save = field => {
    const { dispatch } = this.props;
    const values = {
      ...field,
    };
    const { detail, companyName } = this.state;
    const { companyId } = this.state;
    values.companyName = companyName;
    values.curinger = detail.creater;
    values.curingerId = detail.createBy;
    values.longitude = detail.longitude;
    values.latitudel = detail.latitude;
    values.companyId = companyId;
    values.curingAddr = detail.truobleAddr;
    values.curingContent = detail.truobleContent;
    values.imgUrl = detail.imgUrl;
    dispatch({
      type: 'RoadWorkOrdes/saveData',
      payload: values,
      callback: () => {
        this.changeState(detail.id);
      },
    });
  };

  render() {
    const {
      ContingencyPlan: { data },
      modalVisible,
      handleModalVisible,
      loading,
    } = this.props;
    const { companyModalVisible, detail, companyName } = this.state;

    const parentMethods = {
      selectData: this.selectDataCate,
      handleModalVisible: this.companyHandleModalVisible,
    };

    return (
      <Fragment>
        <Modal
          title={null}
          visible={modalVisible}
          onCancel={() => handleModalVisible()}
          className={style.readModal}
          width={1100}
          footer={null}
        >
          <div className={style.content}>
            <div className={style.leftList}>
              <div className={style.header}>
                <h3>
                  <span />
                  全部工单
                </h3>
                <div className={style.search} style={{ overflow: 'hidden' }}>
                  {this.renderSimpleForm()}
                </div>
              </div>
              <div style={{ height: 610 }}>
                <Spin spinning={loading}>
                  <ul className={style.list}>{this.renderList(data)}</ul>
                </Spin>
              </div>
              <Pagination
                style={{ float: 'right' }}
                size="small"
                total={data.pagination.total}
                pageSize={5}
                onChange={this.handleStandardTableChange}
              />
            </div>
            <RenderDetail
              companyName={companyName}
              detail={detail}
              save={this.save}
              renderImg={this.renderImg}
              companyHandleModalVisible={this.companyHandleModalVisible}
            />
          </div>
        </Modal>
        {companyModalVisible ? (
          <CompanyModal modalVisible={companyModalVisible} {...parentMethods} />
        ) : null}
      </Fragment>
    );
  }
}

export default RoadProductionTroubleModal;

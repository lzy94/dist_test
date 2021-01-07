import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Select, DatePicker, Button } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';
import { imgUrl } from '@/utils/utils';
import defaultImg from '@/assets/notImg.png';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const typeStr = ['相机日志', '传感器', '仪表', '抓拍软件', '称重匹配日志'];
const timeIDS = [
  'camerastatetime',
  'sensortime',
  'instrument_state_time',
  'softwarestatetime',
  'matchdatatime',
];
const camerStatus = ['无相机', '正常', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ Equimentlog, loading }) => ({
  Equimentlog,
  loading: loading.models.Equimentlog,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: 1,
    type: 1,
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  componentDidMount() {
    const { pageBean, formValues } = this.state;
    this.getList({ pageBean, type: formValues });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Equimentlog/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues } = this.state;

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      type: formValues,
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, formValues } = this.state;
    form.resetFields();
    this.setState({
      formValues: 1,
    });
    this.getList({ pageBean, type: 1 });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { pageBean } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue.type || 1,
      });
      this.getList({
        pageBean,
        querys: [
          {
            property: timeIDS[(fieldsValue.type || 1) - 1],
            value: fieldsValue.time ? moment(fieldsValue.time).format('YYYY-MM-DD') : '',
            group: 'main',
            operation: 'RIGHT_LIKE',
            relation: 'AND',
          },
        ].filter(item => item.value),
        type: fieldsValue.type || 1,
      });
    });
  };

  changeType = e => {
    this.setState({ type: e });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { type } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                日志类型
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('type')(
                  <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.changeType}>
                    {typeStr.map((item, index) => (
                      <Option value={index + 1} key={index}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                时间
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('time')(
                  <DatePicker
                    className={publicCss.inputGroupLeftRadius}
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
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

  renderImg = path => {
    return (
      <img
        height={60}
        src={imgUrl + path}
        alt=""
        onError={e => {
          e.target.onerror = null;
          e.target.src = defaultImg;
        }}
      />
    );
  };

  /**
   *
   * @returns {[[], *]}
   */
  renderColumns = () => {
    const { formValues } = this.state;
    let columns = [],
      scroll = {};
    // eslint-disable-next-line default-case
    switch (formValues) {
      case 1:
        for (let i = 1; i <= 20; i++) {
          columns = [
            ...columns,
            {
              title: `相机${i}`,
              dataIndex: `camerastate_${i}`,
              render: (val, record) =>
                i > record.cameranum ? camerStatus[0] : val > 1 ? camerStatus[2] : camerStatus[val], // camerStatus[val]
            },
          ];
        }
        columns = [
          {
            title: '站点号',
            dataIndex: 'siteCode',
          },
          {
            title: '相机数',
            dataIndex: 'cameranum',
          },
          {
            title: '时间',
            width: 170,
            dataIndex: 'camerastatetime',
          },
          ...columns,
        ];
        scroll = { scroll: { x: '150%' } };
        break;
      case 2:
        columns = [
          {
            title: '站点号',
            dataIndex: 'siteCode',
          },
          {
            title: '检测时间',
            width: 170,
            dataIndex: 'sensortime',
          },
          {
            title: '传感器零点',
            children: [],
          },
          {
            title: '传感器状态',
            children: [],
          },
          {
            title: '线圈状态',
            children: [],
          },
        ];
        for (let i = 1; i <= 32; i++) {
          columns[2].children = [
            ...columns[2].children,
            {
              title: `传感器${i}`,
              dataIndex: `sensorzero_${i}`,
              key: `sensorzero_${i}`,
            },
          ];
        }

        for (let i = 1; i <= 32; i++) {
          columns[3].children = [
            ...columns[3].children,
            {
              title: `传感器${i}`,
              dataIndex: `sensorstate_${i}`,
              key: `sensorstate_${i}`,
              render: val => (val ? '使用' : '屏蔽'),
            },
          ];
        }

        for (let i = 1; i <= 16; i++) {
          columns[4].children = [
            ...columns[4].children,
            {
              title: `线圈${i}`,
              dataIndex: `coilstate_${i}`,
              key: `coilstate_${i}`,
              render: val => (val ? '使用' : '屏蔽'),
            },
          ];
        }

        scroll = { scroll: { x: '500%' } };
        break;
      case 3:
        columns = [
          {
            title: '站点号',
            dataIndex: 'siteCode',
          },
          {
            title: '获取时间',
            dataIndex: 'instrument_state_time',
          },
          {
            title: '电压',
            dataIndex: 'm_voltage',
          },
          {
            title: '温度',
            dataIndex: 'm_temperature',
          },
          {
            title: '风扇转速',
            dataIndex: 'm_FanSpeed',
          },
        ];
        break;
      case 4:
        columns = [
          {
            title: '站点号',
            dataIndex: 'siteCode',
          },
          {
            title: '时间',
            width: 170,
            dataIndex: 'softwarestatetime',
          },
          {
            title: '抓拍软件运行状态',
            dataIndex: 'cameraRunState',
            render: val => (val === 11 ? '正常' : '已停止运行并重启过'),
          },
          {
            title: '称重软件运行状态',
            dataIndex: 'weightRunState',
            render: val => (val === 11 ? '正常' : '已停止运行并重启过'),
          },
          {
            title: '轮轴软件运行状态',
            dataIndex: 'axlRunState',
            render: val => (val === 11 ? '正常' : '已停止运行并重启过'),
          },
        ];
        break;
      case 5:
        columns = [
          {
            title: '站点号',
            dataIndex: 'siteCode',
          },
          {
            title: '车牌号',
            dataIndex: 'carnum',
          },
          {
            title: '车牌颜色',
            dataIndex: 'carcolor',
          },
          {
            title: '轴数',
            dataIndex: 'axlnum',
          },
          {
            title: '总重',
            dataIndex: 'totalweight',
          },
          {
            title: '车速',
            dataIndex: 'spend',
          },
          {
            title: '车道号',
            dataIndex: 'lane_num',
          },
          {
            title: '数据接收时间',
            width: 170,
            dataIndex: 'matchdatatime',
          },
          {
            title: '车辆长宽高',
            dataIndex: 'ckg',
            render: (_val, record) =>
              record.carlength + '-' + record.carwidth + '-' + record.carheight,
          },
        ];
        for (let i = 1; i <= 6; i++) {
          columns = [
            ...columns,
            {
              title: `轴${i}重量`,
              dataIndex: `axlweight${i}`,
            },
          ];
        }
        for (let i = 1; i <= 7; i++) {
          columns = [
            ...columns,
            {
              title: `轴${i}单双胎信息`,
              dataIndex: `Axl_${i}`,
            },
          ];
        }

        columns = [
          ...columns,
          {
            title: '车头图片1',
            dataIndex: 'headpicture_name_1',
            render: val => this.renderImg(val),
          },
          {
            title: '车头图片2',
            dataIndex: 'headpicture_name_2',
            render: val => this.renderImg(val),
          },
          {
            title: '侧面图片',
            dataIndex: 'sidepicture_name',
            render: val => this.renderImg(val),
          },
          {
            title: '车尾图片',
            dataIndex: 'tailpicture_name',
            render: val => this.renderImg(val),
          },
          {
            title: '全景图片',
            dataIndex: 'panoramapicture_name',
            render: val => this.renderImg(val),
          },
          {
            title: '车牌图片',
            dataIndex: 'caridpicture_name',
            render: val => this.renderImg(val),
          },
          {
            title: '45°图片',
            dataIndex: 'leftpicture_name',
            render: val => this.renderImg(val),
          },
        ];
        scroll = { scroll: { x: '250%' } };
        break;
    }
    return [columns, scroll];
  };

  render() {
    const {
      Equimentlog: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = this.renderColumns();
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              tableAlert={false}
              selectedRows={selectedRows}
              rowSelection={null}
              loading={loading}
              data={data}
              size="middle"
              {...columns[1]}
              columns={columns[0]}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TableList;

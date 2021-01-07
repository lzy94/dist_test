import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { Card, Form, InputNumber, Button, message, Table, Tooltip, Divider } from 'antd';

import styles from '../../../style/style.less';

/* eslint react/no-multi-comp:0 */
@connect(({ TrafficSystemThreshold, loading }) => ({
  TrafficSystemThreshold,
  loading: loading.models.TrafficSystemThreshold,
}))
@Form.create()
class Threshold extends PureComponent {
  state = {
    data: [],
    value: [],
  };

  cacheData = {};

  columns = [
    {
      title: '轴数',
      width: 60,
      dataIndex: 'axleType',
    },
    {
      title: '标准限重',
      width: 150,
      dataIndex: 'totalLoad',
      render: (val, record) => {
        if (record.isEdit) {
          return (
            <InputNumber
              size="small"
              style={{ width: '100%' }}
              value={val}
              min={0}
              onChange={e => this.handleFieldChange(e, 'totalLoad', record)}
              placeholder="总重"
            />
          );
        }
        return val;
      },
    },
    {
      title: '超限比(%)',
      width: 150,
      dataIndex: 'overLoadRate',
      render: (val, record) => {
        if (record.isEdit) {
          return (
            <InputNumber
              size="small"
              style={{ width: '100%' }}
              value={val}
              min={0}
              onChange={e => this.handleFieldChange(e, 'overLoadRate', record)}
              placeholder="超限比"
            />
          );
        }
        return val;
      },
    },
    {
      title: '超限阈值',
      width: 150,
      dataIndex: 'realLoad',
    },
    {
      title: '操作',
      // width: 100,
      render: (text, record) => {
        if (record.isEdit) {
          return (
            <Fragment>
              <Tooltip placement="left" title="保存">
                <Button
                  onClick={e => this.saveData(e, record)}
                  type="primary"
                  shape="circle"
                  icon="save"
                  size="small"
                />
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip placement="left" title="取消">
                <Button
                  onClick={e => this.cancelTable(e, record, 'table')}
                  type="primary"
                  shape="circle"
                  icon="close-circle"
                  size="small"
                />
              </Tooltip>
            </Fragment>
          );
        }
        return (
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={e => this.toggleEditable(e, record)}
              type="primary"
              shape="circle"
              icon="edit"
              size="small"
            />
          </Tooltip>
        );
      },
    },
  ];

  static getDerivedStateFromProps(nextProps, preState) {
    const {
      TrafficSystemThreshold: {
        data: { list },
      },
    } = nextProps;
    if (isEqual(list, preState.value)) {
      return null;
    }
    return {
      data: list,
      value: list,
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficSystemThreshold/fetch',
      payload: {
        pageBean: { page: 1, pageSize: 20, showTotal: true },
      },
    });
  };

  toggleEditable = (e, itemData) => {
    e.preventDefault();
    const { data } = this.state;
    let newData = JSON.parse(JSON.stringify(data));
    if (!newData[itemData.key].isEdit) {
      this.cacheData = itemData;
    }
    newData = newData.map(item => ({ ...item, isEdit: false }));
    newData[itemData.key].isEdit = true;
    this.setState({ data: newData });
  };

  cancelTable = (e, itemData, type = 'table') => {
    e.preventDefault();
    const { data } = this.state;
    const newData = JSON.parse(JSON.stringify(data));
    newData[itemData.key].isEdit = false;
    if (type === 'table') {
      newData[itemData.key] = this.cacheData;
    }
    this.setState({ data: newData });
  };

  handleFieldChange = (e, fieldName, itemData) => {
    const { data } = this.state;
    const newData = JSON.parse(JSON.stringify(data));
    const newItemData = { ...itemData };
    const { key, totalLoad, overLoadRate } = itemData;
    if (fieldName === 'totalLoad') {
      const realLoad = (overLoadRate / 100) * e + e;
      newItemData['realLoad'] = realLoad;
    } else {
      const realLoad = (e / 100) * totalLoad + totalLoad;
      newItemData['realLoad'] = realLoad;
    }
    newItemData[fieldName] = e;
    newData[key] = newItemData;
    this.setState({ data: newData });
  };

  saveData = (e, data) => {
    e.persist();
    const { dispatch } = this.props;
    const newData = {
      id: data.id,
      axleType: data.axleType,
      realLoad: data.realLoad,
      totalLoad: data.totalLoad,
      overLoadRate: data.overLoadRate,
    };
    dispatch({
      type: 'TrafficSystemThreshold/AUSave',
      payload: newData,
      callback: () => {
        this.cancelTable(e, data, null);
        this.getList();
        // this.toggleEditable(e, data);
        message.success('修改成功');
      },
    });
  };

  render() {
    const { loading } = this.props;
    const { data } = this.state;
    return (
      <Card title="超限阈值" bordered={false}>
        <Table
          size="middle"
          loading={loading}
          columns={this.columns}
          dataSource={data}
          pagination={false}
        />
      </Card>
    );
  }
}

export default Threshold;

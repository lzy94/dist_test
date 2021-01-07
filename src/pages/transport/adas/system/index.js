import React, { PureComponent } from 'react';
import { Radio, Button, Table, Tooltip, Menu } from 'antd';
import BaseMap from '@/pages/conserve/Component/BaseMap';

import styles from './style.less';

const { SubMenu } = Menu;

const dataSource = [
  {
    key: '1',
    carNo: '川B qs678',
    companyName: '四川东恒运输集团有限公司',
    bjType: '车距过近报警',
    name: '李凯',
    ssu: 32,
    esu: 40,
    grade: '一级',
    address: '西湖区湖底公园1号',
    time: '2020-05-15 12:23:00',
    endTime: '2020-05-15 14:25:00',
  },
  {
    key: '2',
    carNo: '川B 07856',
    companyName: '四川东恒运输集团有限公司',
    bjType: '车距过近报警',
    name: '周凯',
    ssu: 32,
    esu: 40,
    grade: '一级',
    address: '西湖区湖底公园1号',
    time: '2020-05-15 12:23:00',
    endTime: '2020-05-15 14:25:00',
  },
  {
    key: '3',
    carNo: '川B za564',
    companyName: '四川东恒运输集团有限公司',
    bjType: '车距过近报警',
    name: '梅林',
    ssu: 32,
    esu: 40,
    grade: '一级',
    address: '西湖区湖底公园1号',
    time: '2020-05-15 12:23:00',
    endTime: '2020-05-15 14:25:00',
  },
];

export default class Adas extends PureComponent {
  columns = [
    {
      title: '车牌号',
      width: 90,
      dataIndex: 'carNo',
    },
    {
      title: '公司名称',
      width: 120,
      dataIndex: 'companyName',
      render: val =>
        val.length > 7 ? <Tooltip title={val}>{val.substring(0, 7) + '...'}</Tooltip> : val,
    },
    {
      title: '报警类型',
      width: 100,
      dataIndex: 'bjType',
    },
    {
      title: '报警等级',
      width: 100,
      dataIndex: 'grade',
    },
    {
      title: '最初报警时间',
      width: 170,
      dataIndex: 'time',
    },
    {
      title: '最后报警时间',
      width: 170,
      dataIndex: 'endTime',
    },
    {
      title: '最初报警速度',
      width: 120,
      dataIndex: 'ssu',
    },
    {
      title: '最后报警速度',
      width: 120,
      dataIndex: 'esu',
    },
  ];

  componentDidMount() {}

  render() {
    return (
      <div className={styles.adasPage}>
        <div className={styles.left}>
          <h3>
            <span>&nbsp;</span>监控中心
          </h3>

          <div style={{ height: 'calc(100% - 30px)', overflowY: 'auto' }}>
            <Menu
              mode="inline"
              // onOpenChange={this.onOpenChange}
              defaultOpenKeys={['sub1']}
              style={{ width: '100%' }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <span>监控</span>
                  </span>
                }
              >
                <Menu.Item key="1">
                  <a href="http://112.45.114.9:8088/CGO8/Login" target="_blank">
                    监控_1
                  </a>
                </Menu.Item>
                <Menu.Item key="2">
                  <a href="http://bmv.cdzhaoyi.com:8088/ASS/Login" target="_blank">
                    监控_2
                  </a>
                </Menu.Item>
                <Menu.Item key="3">
                  <a href="https://zndd30.vehicleplus.net/#/login" target="_blank">
                    监控_3
                  </a>
                </Menu.Item>
              </SubMenu>

              {/* <SubMenu
                key="sub2"
                title={
                  <span>
                    <span>四川东恒运输集团有限公司</span>
                  </span>
                }
              >
                <Menu.Item key="5">川B 056aq 路西</Menu.Item>
                <Menu.Item key="6">川B qs678 李凯</Menu.Item>
                <Menu.Item key="7">川B 07856 周凯</Menu.Item>
                <Menu.Item key="8">川B za564 梅林</Menu.Item> */}
              {/* </SubMenu> */}
            </Menu>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.mapMain}>
            <BaseMap />
            <div className={styles.videoList}>
              <div className={styles.videoCell}>
                <div className={styles.video} />
              </div>
              <div className={styles.videoCell}>
                <div className={styles.video} />
              </div>
            </div>
          </div>
          <div className={styles.tableMain}>
            <div className={styles.tableTool}>
              <Radio.Group defaultValue="a">
                <Radio.Button value="a">前向预警</Radio.Button>
                <Radio.Button value="b">驾驶异常</Radio.Button>
                <Radio.Button value="c">胎压预警</Radio.Button>
                <Radio.Button value="d">盲区预警</Radio.Button>
                <Radio.Button value="e">定位预警</Radio.Button>
                <Radio.Button value="f">指令跟踪</Radio.Button>
              </Radio.Group>
              <div>
                <Button size="small" type="primary" shape="circle" icon="delete" />
                <Button
                  style={{ marginLeft: 5 }}
                  size="small"
                  type="primary"
                  shape="circle"
                  icon="download"
                />
                <Button
                  style={{ marginLeft: 5 }}
                  size="small"
                  type="primary"
                  shape="circle"
                  icon="edit"
                />
              </div>
            </div>
            <div style={{ padding: '10px 20px' }}>
              <Table
                size="middle"
                pagination={false}
                dataSource={dataSource}
                columns={this.columns}
                scroll={{ y: 200, x: 'calc(700px + 50%)' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// import React from 'react';
// import { Card, Button } from 'antd';
// import styles from './style.less';

// const btnSty = {
//   marginRight: 10,
// };

// const VideoLink = () => (
//   <div className={styles.main}>
//     <Card bordered={false} title="">
//       <Button
//         type="primary"
//         style={btnSty}
//         href="http://112.45.114.9:8088/CGO8/Login"
//         target="_blank"
//       >
//         监测_1
//       </Button>
//       <Button
//         type="primary"
//         style={btnSty}
//         href="http://bmv.cdzhaoyi.com:8088/ASS/Login"
//         target="_blank"
//       >
//         监测_2
//       </Button>
//       <Button
//         type="primary"
//         style={btnSty}
//         href="https://zndd30.vehicleplus.net/#/login"
//         target="_blank"
//       >
//         监测_3
//       </Button>
//     </Card>
//   </div>
// );
// export default VideoLink;

import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Link } from 'dva/router';
import { Modal } from 'antd';
import moment from 'moment';
import style from './index.less';
import { clearItem2 } from '@/utils/utils';

const [itemType, ZH, EN, img] = [
  ['-1', '-2', '-3', '-4', '-5'],
  ['路政管理', '养护管理', '海事管理', '运政管理', '建设管理'],
  [
    'Road Administration',
    'Maintenance',
    'Maritime affairs',
    'Transport Administration',
    'Construction management',
  ],
  [1, 2, 3, 4, 5],
];
const routers = ['/traffic', '/conserve', '/maritime', '/transport', '/build'];

class SelectPage extends PureComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    this.interval = null;
    this.mainMsg = JSON.parse(localStorage.getItem('mainMsg') || '{}');
  }

  state = {
    name: '',
    time: '00:00',
    date: '00/00/00',
  };

  componentDidMount() {
    clearItem2();
    if (!Object.keys(this.mainMsg).length) {
      // Modal.error({
      //   title: '提示',
      //   content: '该用户还没有分配部门，请联系管理员',
      //   onOk: () => {
      // message.error('该用户还没有分配部门，请联系管理员')
      const { history } = this.props;
      history.push('/user/login');
      // },
      // });
      return;
    }
    this.initial();
    this.time();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.isRender = false;
  }

  initial = () => {
    const department = this.mainMsg.department || '';
    const newDepartments = department.split(',');
    localStorage.setItem('len', newDepartments.length);
    if (newDepartments.length === 1) {
      const index = itemType.indexOf(newDepartments[0]);
      router.push(routers[index]);
      this.isRender = false;
    } else {
      this.isRender = true;
    }
  };

  time = () => {
    // const mainMsg = localStorage.getItem('mainMsg');
    if (Object.keys(this.mainMsg).length) {
      this.setState({ name: this.mainMsg.name });
    }
    this.setTime();
    this.interval = setInterval(() => {
      this.setTime();
    }, 1000);
  };

  setTime = () => {
    const time = moment().format('HH:mm');
    const date = moment().format('YYYY/MM/DD');
    this.setState({
      time,
      date,
    });
  };

  // 建设 路政  养护 运政 海事
  renderItem = () => {
    // const mainMsg = localStorage.getItem('mainMsg') || '{}';
    const department = this.mainMsg.department || '';
    if (!department) return null;
    const newDepartments = department.split(',');
    // const check = this.initial(newDepartments);
    // if (check) return null;
    return newDepartments.map(item => {
      const index = itemType.indexOf(item);
      const path = require(`@/assets/selectPage/${index + 1}.png`);
      if (index > -1) {
        return (
          <li key={index}>
            <Link to={routers[index]} replace>
              <img src={path} alt={ZH[index]} />
              <h3>
                {ZH[index]}
                <small>{EN[index]}</small>
              </h3>
            </Link>
          </li>
        );
      }
      return '';
    });
  };

  // clickEvent = item => {
  //   console.log(item);
  // localStorage.setItem('department', item);
  // router.push('/');
  // router.replace('/')
  // };

  render() {
    const { time, date, name } = this.state;
    return (
      this.isRender && (
        <div className={style.main}>
          <div className={style.panel}>
            <div className={style.timeStamp}>
              <span className={style.time}>{time}</span>
              <div className={style.dataMain}>
                <span>{date}</span>
                <span>{name}</span>
              </div>
            </div>
            <ul className={style.item}>{this.renderItem()}</ul>
          </div>
        </div>
      )
    );
  }
}

export default SelectPage;

import React, { PureComponent } from 'react';
// import router from 'umi/router';
import { Link, routerRedux } from 'dva/router';
import { Modal } from 'antd';
import moment from 'moment';
import style from './index.less';
import { clearItem2 } from '@/utils/utils';

class SelectPage extends PureComponent {
  constructor(props) {
    super(props);
    this.interval = null;
  }

  state = {
    name: '',
    time: '00:00',
    date: '00/00/00',
  };

  componentDidMount() {
    clearItem2();
    const mainMsg = localStorage.getItem('mainMsg');
    if (!mainMsg) {
      Modal.error({
        title: '提示',
        content: '该用户还没有分配部门，请联系管理员',
        onOk: () => {
          window.location.href = '/#/user/login';
        },
      });
      return;
    }
    this.time();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  time = () => {
    const mainMsg = localStorage.getItem('mainMsg');
    if (mainMsg) {
      this.setState({ name: JSON.parse(mainMsg).name });
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
    const mainMsg = localStorage.getItem('mainMsg') || '{}';
    const department = JSON.parse(mainMsg).department || '';
    const [itemType, ZH, EN] = [
      ['-1', '-2', '-3', '-4'],
      ['路政管理', '养护管理', '海事管理', '运政管理'],
      ['Road Administration', 'Maintenance', 'Maritime affairs', 'Transport Administration'],
    ];
    const routers = ['/traffic', '/conserve', '/maritime', '/transport'];
    if (!department) return '';
    const newDepartments = department.split(',');
    return newDepartments.map(item => {
      const index = itemType.indexOf(item);
      const path = require(`@/assets/selectPage/${index + 1}.png`);
      if (index > -1) {
        return (
          <li key={index}>
            <Link to={routers[index]} replace>
              <h3>
                {ZH[index]}
                <small>{EN[index]}</small>
              </h3>
              <img src={path} alt={ZH[index]} />
            </Link>
          </li>
        );
      }
      return '';
    });
  };
  // http://dasmrb.com/

  // clickEvent = item => {
  //   console.log(item);
  // localStorage.setItem('department', item);
  // router.push('/');
  // router.replace('/')
  // };

  render() {
    const { time, date, name } = this.state;
    return (
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
    );
  }
}

export default SelectPage;

import React, { PureComponent } from 'react';
// import { routerRedux } from 'dva/router';
import { Form, Input, Button, Icon, Row, Col, Alert } from 'antd';
import { connect } from 'dva';
import ReactParticleLine from 'react-particle-line';
import style from './index.less';
import logo from '@/assets/login2/logo.png';

const FormItem = Form.Item;
let code = '';

/* eslint react/no-multi-comp:0 */
@connect(({ CarGPS, system, userLogin, loading, user }) => ({
  CarGPS,
  system,
  user,
  userLogin,
  loading: loading.models.userLogin,
}))
@Form.create()
class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.code = React.createRef();
  }

  componentDidMount() {
    this.codeCanvas(this.code);
  }

  componentWillUnmount() {
    code = '';
  }

  changeCode = () => {
    this.codeCanvas(this.code);
  };

  getRandomColor = () => {
    const rand = Math.floor(Math.random() * 0xffffff).toString(16);
    if (rand.length === 6) {
      return rand;
    }
    return this.getRandomColor();
  };

  createCode = () => {
    code = '';
    const random = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    // 验证码长度为4位
    const codeLength = 4;
    for (let i = 0; i < codeLength; i++) {
      // 验证码的字符在array中的下标在0-36之间
      const index = Math.floor(Math.random() * 36);
      code += random[index];
    }
    return code;
  };

  // 干扰线的随机x坐标值
  lineX = () => {
    // 坐标值在width之内
    const ranLineX = Math.floor(Math.random() * 80);
    return ranLineX;
  };

  // 干扰线的随机y坐标值
  lineY = () => {
    // 坐标值在height之内
    const ranLineY = Math.floor(Math.random() * 57);
    return ranLineY;
  };

  // 传入的参数表示canvas节点
  // 传入参数主要是在react中方便使用，若为原生HTML，可在此方法内通过getElementById的方法直接获取节点
  codeCanvas = codeShow => {
    const cxt = codeShow.getContext('2d');
    // 背景颜色
    cxt.fillStyle = 'rgba(0,0,0,.3)';
    // 矩形左上角x,y坐标以及矩形宽高
    cxt.fillRect(0, 0, 80, 57);
    // 生成干扰线20条
    for (let j = 0; j < 20; j++) {
      // 线条的颜色
      cxt.strokeStyle = `#${this.getRandomColor()}`;
      // 若省略beginPath，则每点击一次验证码会累积干扰线的条数
      cxt.beginPath();
      cxt.moveTo(this.lineX(), this.lineY());
      cxt.lineTo(this.lineX(), this.lineY());
      cxt.lineWidth = 0.5;
      cxt.closePath();
      cxt.stroke();
    }
    // 不设置的话里面的文本颜色就是和上面设置的背景色相同
    cxt.fillStyle = '#fff';
    cxt.font = 'lighter 20px Arial';
    // 把生成的随机数文本填充到canvas中
    cxt.fillText(this.createCode(), 16, 35);
  };

  showErroe = () => {
    const {
      userLogin: { status },
    } = this.props;
    if (status === 200) return <></>;
    let msg = '';
    if (status === 20) {
      msg = '验证码错误';
    } else if (status === 100) {
      msg = '账号或密码错误';
    }

    return <Alert message={msg} type="error" showIcon style={{ marginBottom: 10 }} />;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'userLogin/login',
          payload: {
            value: values,
            code,
          },
          callback: () => {
            // const { department } = JSON.parse(localStorage.getItem('mainMsg') || '{}');
            // if (department.indexOf('-1') > -1) {
            //   dispatch({
            //     type: 'CarGPS/carGPSToken',
            //   });
            // }

            dispatch({
              type: 'user/fetchCurrent',
              callback: res => {
                localStorage.setItem('organId', res.organId);
                // dispatch({
                //     type: 'system/getTree',
                //     payload: {
                //         cityCode: res.organId
                //     }
                // });
                // dispatch({
                //     type: 'system/warningMsgNotDu',
                //     payload: { siteCodes: res.siteIds }
                // })
              },
            });
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      userLogin: { status },
      loading,
    } = this.props;
    return (
      <div className={style.main}>
        <ReactParticleLine>
          <div className={style.header}>智慧交通治理平台</div>

          <div className={style.formMain}>
            <h3>登录账号</h3>
            {status ? <div className={style.errTip}>{this.showErroe()}</div> : null}
            <Form onSubmit={this.handleSubmit} autoComplete="off">
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: '#fff' }} />}
                    placeholder="请输入用户名"
                    className={style.Input}
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: '#fff' }} />}
                    type="password"
                    className={style.Input}
                    placeholder="请输入密码"
                  />,
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={19}>
                    {getFieldDecorator('yzm', {
                      rules: [{ required: true, message: '请输入验证码' }],
                    })(
                      <Input
                        prefix={<Icon type="picture" style={{ color: '#fff' }} />}
                        className={style.Input}
                        placeholder="请输入验证码"
                      />,
                    )}
                  </Col>
                  <Col span={5}>
                    <canvas
                      ref={el => (this.code = el)}
                      width="100%"
                      height="57"
                      title="看不清，点我换一张"
                      onClick={() => this.changeCode()}
                    />
                  </Col>
                </Row>
              </FormItem>
              <Button
                type="primary"
                block
                htmlType="submit"
                className={style.loginButton}
                loading={loading}
              >
                登录
              </Button>
            </Form>
          </div>
        </ReactParticleLine>
      </div>
    );
  }
}

export default Login;

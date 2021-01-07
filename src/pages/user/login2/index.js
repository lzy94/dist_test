import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Row, Col, Alert } from 'antd';
import LoginCss from './login.less';
import logo from '@/assets/login/logo.png'
import { getLocalStorage } from '@/utils/utils';
import { Redirect } from 'umi';

const FormItem = Form.Item;
let code = '';

/* eslint react/no-multi-comp:0 */
@connect(({ userLogin, loading, user }) => ({
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

  state = {
    isToken: true
  };

  componentDidMount() {
    const token = getLocalStorage('token');
    if (token.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userLogin/isToken',
        callback: res => {
          // this.setState({isToken: !!res.data})
        }
      });
    }
    this.codeCanvas(this.code);
  }

  componentWillUnmount() {
    code = '';
  }

  changeCode() {
    this.codeCanvas(this.code);
  }

  getRandomColor = () => {
    const rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    if (rand.length === 6) {
      return rand;
    }
    return this.getRandomColor();
  };

  createCode = () => {
    code = "";
    const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
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
    const ranLineY = Math.floor(Math.random() * 36);
    return ranLineY;
  };

  // 传入的参数表示canvas节点
  // 传入参数主要是在react中方便使用，若为原生HTML，可在此方法内通过getElementById的方法直接获取节点
  codeCanvas = (codeShow) => {
    const cxt = codeShow.getContext('2d');
    // 背景颜色
    cxt.fillStyle = '#8dd5e7';
    // 矩形左上角x,y坐标以及矩形宽高
    cxt.fillRect(0, 0, 80, 45);
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
    cxt.fillText(this.createCode(), 16, 30);
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
            code: code
          }
        })

      }
    });
  };

  showErroe = () => {
    const { userLogin: { status } } = this.props;
    if (status === 200) return <></>;
    let msg = '';
    if (status === 20) {
      msg = '验证码错误';
    } else if (status === 100) {
      msg = '账号或密码错误'
    }

    return <Alert
      message={msg}
      type="error"
      showIcon
      style={{ marginBottom: 10 }}
    />
  };

  render() {
    const {
      form: { getFieldDecorator },
      userLogin: { status },
      loading
    } = this.props;
    const { isToken } = this.state;
    return (<>
      {!isToken ? <Redirect to='/' /> :
        <div className={LoginCss.loginMain}>
          <div className={LoginCss.loginPanel}>
            <div className={LoginCss.left}></div>
            <div className={LoginCss.right}>
              <div className={LoginCss.logo}>
                <img src={logo} />
              </div>
              <div className={LoginCss.title}>
                <h3>综合交通执法管理平台</h3>
                <p>Traffic law enforcement management platform</p>
              </div>
              <div className={LoginCss.Form}>
                <p className={LoginCss.tips}>
                  Please enter your <strong>account</strong> and <strong>password </strong>
                  to login.</p>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  {status ? this.showErroe() : null}
                  <FormItem>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: '请输入用户名' }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请输入用户名"
                        className={LoginCss.Input}
                      />,
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码' }],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        className={LoginCss.Input}
                        placeholder="请输入密码"
                      />,
                    )}
                  </FormItem>
                  <FormItem>
                    <Row gutter={8}>
                      <Col span={17}>
                        {getFieldDecorator('yzm', {
                          rules: [{ required: true, message: '请输入验证码' }],
                        })(
                          <Input
                            prefix={<Icon type="picture" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            className={LoginCss.Input}
                            placeholder="请输入验证码"
                          />,
                        )}
                      </Col>
                      <Col span={7}>
                        <canvas ref={el => this.code = el} width='100%' height='45' title="看不清，点我换一张"
                          onClick={() => this.changeCode()}></canvas>
                      </Col>
                    </Row>
                  </FormItem>
                  <Button type="primary" block htmlType="submit" className={LoginCss.loginButton} loading={loading}>
                    登录
                    </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      }
    </>
    );
  }


}

export default Login;

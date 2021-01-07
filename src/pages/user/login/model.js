import { routerRedux } from 'dva/router';
import { fakeAccountLogin, isTokenExpired } from './service';
import { getCurrentUserMethodAuth } from '@/services/user';
import { filterResponse, getPageQuery, setAuthority, setLocalStorage } from '@/utils/utils';

export default {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    * login({ payload, callback }, { call, put }) {
      if (payload.code.toLowerCase() !== payload.value.yzm.toLowerCase()) {
        yield put({
          type: 'changeLoginStatus',
          payload: { code: 20 },
        });
        return;
      }
      const response = yield call(fakeAccountLogin, payload.value);
      filterResponse(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      if (response.code === 200) {
        const res = response.data;
        setLocalStorage('token', res.token);
        localStorage.setItem('mainMsg', JSON.stringify({
          department: res.department,
          name: res.username,
        }));
        const auth = yield call(getCurrentUserMethodAuth);
        setLocalStorage('auth', auth.data.curUserMethod);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put({
          type: 'changeLoginStatus',
          payload: { code: undefined },
        });
        callback && callback();
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    * isToken({ payload, callback }, { call, put }) {
      const response = yield call(isTokenExpired);
      callback && callback(response);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      // setAuthority(payload.data.token);
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.code,
        // type: payload.type,
        // type:'account'
      };
    },
  },
};

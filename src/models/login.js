import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { setAuthority, filterResponse, getLocalStorage, clearItem } from '@/utils/utils';
import request from '@/utils/request';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        clearItem();
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            // search: stringify({
            //     redirect: window.location.href,
            // }),
          }),
        );
      }
    },
    * changpass({ payload, callback }, { call, put }) {
      const newData = request('/result/api/uc/user/changUserPsd', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
        },
        data: {
          ...payload,
        },
      });
      Promise.all([newData]).then(value => {
        const newData = filterResponse(value[0]);
        if (newData === 200) {
          if (callback) {
            callback();
          }
        }
      });
      // yield call(changUserPsd,payload)
      // // const newData = filterResponse(yield call(changUserPsd,payload));
      // if(newData === 200){
      //     if(callback){callback()}
      // }
    },

  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;

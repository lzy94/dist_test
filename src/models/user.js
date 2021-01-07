import { query as queryUsers, queryCurrent, getCurrentUserMethodAuth } from '@/services/user';
import { setLocalStorage, filterResponse } from '@/utils/utils';
import { updateSystemUser } from '@/services/systemUser';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    authList: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent({ payload, callback }, { call, put }) {
      const response = yield call(queryCurrent);
      filterResponse(response);
      localStorage.setItem('organId', response.organId);
      localStorage.setItem('siteIds', response.siteIds);
      localStorage.setItem('staticSite', response.staticSite);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      callback && callback(response);
    },
    *getCurrentUserMethodAuth(_, { call }) {
  const response = yield call(getCurrentUserMethodAuth);
  filterResponse(response);
  if (response.code === 200) {
    setLocalStorage('auth', response.data.curUserMethod);
  }
  // yield put({
  //     type:'saveAuth',
  //     payload:response
  // })
},
    *updateUser({ payload, callback }, { call }) {
  // console.log(payload);
  const response = yield call(updateSystemUser, payload);
  const newData = filterResponse(response);
  if (newData === 200) {
    callback && callback();
  }
},
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    // saveAuth(state,action){
    //     return {
    //         ...state,
    //         authList
    //     }
    // },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;

import {
  queryRole, removeRole, addRole, updateRole, activateUser,
  forbiddenUser, getRoleDetail, getByRoleAlias, saveSystemRoleAlias,
  removeByRoleAlias, getRoleUsers, saveUserRole, deleteUserRole,
} from './service';
import { querySystemUserList } from '@/services/systemUser';
import { filterResponse } from '@/utils/utils';


export default {
  namespace: 'Role',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    roleUserList: {
      list: [],
      pagination: {},
    },
    detailData: {},
    userData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(addRole, payload));
      if (newData === 200) {
        // const response = yield call(queryRole, payload.query);
        // yield put({
        //     type: 'save',
        //     payload: response,
        // });
        if (callback) callback();
      }
    },
    * remove({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(removeRole, payload));
      if (newData === 200) {
        // const response = yield call(queryRole, payload.query);
        // yield put({
        //     type: 'save',
        //     payload: response,
        // });
        if (callback) callback();
      }
    },
    * update({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(updateRole, payload));
      if (newData === 200) {
        // const response = yield call(queryRole, payload.query);
        // yield put({
        //     type: 'save',
        //     payload: response,
        // });
        if (callback) callback();
      }
    },
    * detailData({ payload, callback }, { call, put }) {
      const response = yield call(getRoleDetail, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'detail',
          payload: response.data || {},
        });
        if (callback) callback(response.data);
      }

    },
    * activate({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(activateUser, payload));
      if (newData === 200) {
        // const response = yield call(queryRole, payload.query);
        // yield put({
        //     type: 'save',
        //     payload: response,
        // });
        if (callback) callback();
      }
    },
    * forbidden({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(forbiddenUser, payload));
      if (newData === 200) {
        // const response = yield call(queryRole, payload.query);
        // yield put({
        //     type: 'save',
        //     payload: response,
        // });
        if (callback) callback();
      }
    },
    * roleAlias({ payload, callback }, { call, put }) {
      const response = yield call(getByRoleAlias, payload);
      callback((response.data || []).map(item => item.menuId));
    },
    * saveRoleAlias({ payload, callback }, { call, put }) {
      const response = yield call(saveSystemRoleAlias, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        if (callback) callback();
      }
    },
    * clearRoleAlias({ payload, callback }, { call, put }) {
      const response = yield call(removeByRoleAlias, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        if (callback) callback();
      }
    },
    * removeRoleUser({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(deleteUserRole, payload));
      if (newData === 200) {
        // const response = yield call(getRoleUsers, payload.query);
        // yield put({
        //   type: 'saveRoleUserList',
        //   payload: response,
        // });
        if (callback) callback();
      }
    },
    * roleUsersList({ payload, callback }, { call, put }) {
      const response = yield call(getRoleUsers, payload);
      yield put({
        type: 'saveRoleUserList',
        payload: response,
      });
      if (callback) callback();
    },
    * saveUserRoleData({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(saveUserRole, payload));
      if (newData === 200) {
        // const response = yield call(getRoleUsers, payload.query);
        // yield put({
        //   type: 'saveRoleUserList',
        //   payload: response,
        // });
        if (callback) callback();
      }
    },
    * getUserData({ payload, callback }, { call, put }) {
      const response = yield call(querySystemUserList, payload);
      yield put({
        type: 'saveUserData',
        payload: response.data || [],
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: (action.payload.data || {}).rows,
          pagination: {
            total: action.payload.data.total,
            pageSize: action.payload.data.pageSize,
            current: action.payload.data.page,
          },
        },
      };
    },
    saveUserData(state, action) {
      return {
        ...state,
        userData: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
    saveRoleUserList(state, action) {
      return {
        ...state,
        roleUserList: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
    detail(state, action) {
      return {
        ...state,
        detailData: action.payload,
      };
    },
  },
};

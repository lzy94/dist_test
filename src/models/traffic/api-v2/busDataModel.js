/**
 * @description 检测数据服务
 */
import {
  getBusDynamicDataForPage,
  getDynamicDataById,
  toSubmitEntry,
  getFocusData,
  toLawCaseReturn,
  fromLawCaseRevoke,
  toVerifyPass,
  setAfterRegister,
  busDynamicDataExport,
} from '@/services/traffic/api-v2/busDataService';
import { filterResponse, downLoadFile } from '@/utils/utils';

export default {
  namespace: 'TrafficApiV2BusData',

  state: {
    // 动态检测数据
    dyData: {
      list: [],
      pagination: {},
    },
    msgDyData: {
      list: [],
      pagination: {},
    },
    dyDataDetail: {
      registerInfo: null,
      openRecord: [],
      busDynamicLawDate: {},
    },
  },

  effects: {
    // 动态检测数据
    *busDynamicDataForPage({ payload }, { call, put }) {
      const response = yield call(getBusDynamicDataForPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'dyDataSave',
          payload: response.data,
        });
      }
    },
    *msgList({ payload }, { call, put }) {
      const response = yield call(getBusDynamicDataForPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'msgDyDataSave',
          payload: response.data,
        });
      }
    },
    // 动态检测详情
    *dyDataDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDynamicDataById, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'dyDataDetailSave',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    // 清空列表
    *resetList(_, { put }) {
      yield put({
        type: 'resetListSave',
      });
    },
    // 清空详情
    *resetDetail(_, { put }) {
      yield put({
        type: 'resetDetailSave',
      });
    },
    // 交警推送
    *submitEntry({ payload, callback }, { call }) {
      const response = yield call(toSubmitEntry, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    // 重点关注
    *focusData({ payload, callback }, { call }) {
      const response = yield call(getFocusData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    // 退回重审
    *lawCaseReturn({ payload, callback }, { call }) {
      const response = yield call(toLawCaseReturn, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    // 撤销处罚
    *lawCaseRevoke({ payload, callback }, { call }) {
      const response = yield call(fromLawCaseRevoke, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    // 初审通过
    *verifyPass({ payload, callback }, { call }) {
      const response = yield call(toVerifyPass, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    // 证据保存成功后更改检测数据状态
    *afterRegister({ payload, callback }, { call }) {
      const response = yield call(setAfterRegister, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    // 导出
    *import({ payload, callback }, { call }) {
      const response = yield call(busDynamicDataExport, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, '动态检测数据.xlsx');
        callback && callback(200);
      }
      // const status = filterResponse(response);
      // if (status === 200) {
      //   if (callback) callback();
      // }
    },
  },

  reducers: {
    // 动态检测数据
    dyDataSave(state, action) {
      const { total, pageSize, currentPageNo, dynamicDatas } = action.payload;
      return {
        ...state,
        dyData: {
          list: dynamicDatas,
          pagination: {
            total,
            pageSize,
            current: currentPageNo,
          },
        },
      };
    },
    msgDyDataSave(state, action) {
      const { total, pageSize, currentPageNo, dynamicDatas } = action.payload;
      return {
        ...state,
        msgDyData: {
          list: dynamicDatas,
          pagination: {
            total,
            pageSize,
            current: currentPageNo,
          },
        },
      };
    },

    // 动态检测详情
    dyDataDetailSave(state, action) {
      return {
        ...state,
        dyDataDetail: action.payload,
      };
    },
    // 清空列表
    resetListSave(state) {
      return {
        ...state,
        dyData: {
          list: [],
          pagination: {},
        },
      };
    },
    // 清空详情
    resetDetailSave(state) {
      return {
        ...state,
        dyDataDetail: {
          registerInfo: null,
          openRecord: [],
          busDynamicLawDate: {},
        },
      };
    },
  },
};

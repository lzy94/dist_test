import { message } from 'antd';
import {
  getCarGpsToken,
  getVHisTrack24,
  getOpGpVclPosColor,
  getVehicleInfoCompleteV21,
  getVHisTrack,
  getVQueryLicenseV2,
  getList,
  getDeteil,
  updateData,
  delData,
} from '@/services/traffic/overview/gps/service';

import { filterResponse } from '@/utils/utils';

function filterCode(data) {
  const newData = JSON.parse(data);
  const { status } = newData;
  if (status === 1001) {
    return data;
  }
  if (status === 1006) {
    message.error('无结果');
    return '';
  }
  if (status === 1016) {
    message.error('令牌失效');
    return '';
  }
  message.error(newData.result);
  return '';
}

function resultData(response, callback) {
  const { code, data } = response;
  if (code === 200) {
    const result = filterCode(data);
    if (result) {
      callback(result);
    }
  } else if (code === 401) {
    message.error('token 已过期请重新登录');
  } else {
    message.error(response.msg || '');
  }
}

export default {
  namespace: 'CarGPS',
  state: { data: { list: [] } },
  effects: {
    *carGPSToken(_, { call }) {
      const response = yield call(getCarGpsToken);
      const { code, data } = response;
      if (code === 200) {
        localStorage.setItem('carToken', data);
      }
    },
    // 车辆完整信息查询
    *vehicleInfoCompleteV21({ payload, callback }, { call }) {
      const response = yield call(getVehicleInfoCompleteV21, payload);
      if (response.code === 401) {
        message.error('token 已过期请重新登录');
      } else if (response.code === 200) {
        if (callback) callback(response.data);
      } else {
        message.error(response.msg || response.message);
      }
      // const status = filterResponse(response);
      // if (status === 200) {
      //   if (callback) callback(response.data);
      // }
      // resultData(response, res => {
      //   callback(res);
      // });
    },
    // 车辆轨迹（车牌+颜色）查询
    *vHisTrack24({ payload, callback }, { call }) {
      const response = yield call(getVHisTrack24, payload);
      resultData(response, res => {
        callback(res);
      });
    },
    // 车辆最新位置（车牌+颜色）查询
    *opGpVclPosColor({ payload, callback }, { call }) {
      const response = yield call(getOpGpVclPosColor, payload);
      resultData(response, res => {
        callback(res);
      });
    },
    // 列表轨迹查询
    *vHisTrack({ payload, callback }, { call }) {
      const response = yield call(getVHisTrack, payload);
      resultData(response, res => {
        callback(res);
      });
    },
    // 车辆行驶证信息查询（车牌+颜色）
    *vQueryLicenseV2({ payload, callback }, { call }) {
      const hide = message.loading('正在获取信息······', 0);
      const response = yield call(getVQueryLicenseV2, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
      hide();
    },
    // 定位配置
    *list(_, { call, put }) {
      const response = yield call(getList);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    *del({ payload, callback }, { call }) {
      const response = yield call(delData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getDeteil, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        data: {
          list: action.payload,
        },
      };
    },
  },
};

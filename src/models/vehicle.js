import {
  queryVehicle,
  removeVehicle,
  addVehicle,
  updateVehicle,
  getVehicleDetail,
} from '@/services/vehicle';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'Vehicle',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryVehicle, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
    },
    *add({ payload, callback }, { call }) {
  const response = yield call(addVehicle, payload);
  const newData = filterResponse(response);
  if (newData === 200) {
    if (callback) callback();
  }
},
    *remove({ payload, callback }, { call }) {
  const response = yield call(removeVehicle, payload);
  const newData = filterResponse(response);
  if (newData === 200) {
    if (callback) callback();
  }
},
    *update({ payload, callback }, { call }) {
  const response = yield call(updateVehicle, payload);
  const newData = filterResponse(response);
  if (newData === 200) {
    if (callback) callback();
  }
},
    *detail({ payload, callback }, { call }) {
  const response = yield call(getVehicleDetail, payload);
  const newData = filterResponse(response);
  if (newData === 200) {
    if (callback) callback(response.data || {});
  }
},
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
  },
};

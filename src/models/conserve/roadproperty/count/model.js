import { getRoadCount, getOtherCount, getAllByLevel } from '@/services/conserve/roadproperty/count/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ConserveGIS',

  state: {
    roadCountData: [],
    otherCountData: {
      ROAD_INFO: [],
      ROAD_PRODUCTION: [],
    },
  },

  effects: {
    * roadCount(_, { call, put }) {
      const response = yield call(getRoadCount);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveRoadCountData',
          payload: response.data,
        });
      }
    },
    * otherCount({ payload, callback }, { call, put }) {
      const response = yield call(getOtherCount);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveOtherCountData',
          payload: response.data,
        });
        callback && callback();
      }
    },
    *allByLevel({ payload, callback }, { call }) {
  const response = yield call(getAllByLevel);
  const status = filterResponse(response);
  if (status === 200) {
    callback(response.data);
  }
},
  },

  reducers: {
    saveRoadCountData(state, action) {
      return {
        ...state,
        roadCountData: action.payload,
      };
    },
    saveOtherCountData(state, action) {
      return {
        ...state,
        otherCountData: { ...action.payload },
      };
    },
  },
};

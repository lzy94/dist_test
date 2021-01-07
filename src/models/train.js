import {
  getTrainForPage,
  addTrain,
  updateTrain,
  deleteTrain
} from '@/services/train';
import {filterResponse} from '@/utils/utils';

export default {
  namespace: 'LawenforTrain',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(getTrainForPage, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    * add({payload, callback}, {call, put}) {
      const response = yield call(addTrain, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * remove({payload, callback}, {call, put}) {
      const response = yield call(deleteTrain, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * update({payload, callback}, {call, put}) {
      const response = yield call(updateTrain, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
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
            current: action.payload.page
          }
        },
      };
    },
  },
};

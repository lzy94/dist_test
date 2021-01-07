import {queryList, addData, deleteData} from './service';
import {filterResponse} from '@/utils/utils';

export default {
  namespace: 'LawEmforcementTemplate',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryList, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
    },
    * add({payload, callback}, {call}) {
      const response = yield call(addData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * remove({payload, callback}, {call}) {
      const response = yield call(deleteData, payload);
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
        }
      };
    },
  },
};

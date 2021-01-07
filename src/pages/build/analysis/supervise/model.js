import { getInspector } from '../service';
import { filterResponse } from '@/utils/utils';
import { logsCateChild } from '@/utils/constant';

const newCate = logsCateChild[2];

function getColumns() {
  const arr = [
    {
      title: '问题类别',
      width: 120,
      dataIndex: 'list_0',
      fixed: 'left',
    },
  ];
  for (let i = 0; i < newCate.length; i += 1) {
    arr.push({
      title: newCate[i],
      dataIndex: `list_${i + 1}`,
    });
  }
  return arr;
}

function getData(list) {
  const obj1 = {
    id: 1,
    list_0: '问题个数',
  };

  for (let i = 0; i < newCate.length; i += 1) {
    obj1[`list_${i + 1}`] = 0;
  }

  const keys = Object.keys(list);

  for (let i = 0; i < keys.length; i += 1) {
    const index = newCate.indexOf(keys[i]);
    obj1[`list_${index + 1}`] = list[keys[i]];
  }

  return [obj1];
}

export default {
  namespace: 'BuildAnalysisSupervise',

  state: {
    data: {
      list: [],
      columns: [],
    },
  },

  effects: {
    *inspecto({ payload }, { call, put }) {
      const response = yield call(getInspector, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      const list = action.payload;
      return {
        ...state,
        data: {
          list: getData(list),
          columns: getColumns(),
        },
      };
    },
  },
};

import { getUnitproject } from '../service';
import { filterResponse } from '@/utils/utils';
import { cate } from '@/utils/constant';
const newCate = cate.slice(1);

function getColumns(list) {
  const arr = [
    {
      title: '单位工程',
      width: 170,
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
  const [obj1, obj2, obj3] = [
    {
      id: 1,
      list_0: '检测数（点/组/测区）',
    },
    { id: 2, list_0: '合格数（点/组/测区）' },
    { id: 3, list_0: '合格率（%）' },
  ];

  for (let i = 0; i < newCate.length; i += 1) {
    obj1[`list_${i + 1}`] = 0;
    obj2[`list_${i + 1}`] = 0;
    obj3[`list_${i + 1}`] = 0;
  }

  for (let i = 0; i < list.length; i++) {
    const index = newCate.indexOf(list[i].catogery);
    obj1[`list_${index + 1}`] = list[i].checkNum;
    obj2[`list_${index + 1}`] = list[i].passNum;
    obj3[`list_${index + 1}`] = list[i].passPercent * 100;
  }

  return [obj1, obj2, obj3];
}

export default {
  namespace: 'BuildSafetyUnit',

  state: {
    data: {
      list: [],
      columns: [],
    },
  },

  effects: {
    *unitproject({ payload, callback }, { call, put }) {
      const response = yield call(getUnitproject, payload);
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
          columns: getColumns(list),
        },
      };
    },
  },
};

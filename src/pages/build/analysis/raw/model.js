import { getRawmaterails } from '../service';
import { filterResponse } from '@/utils/utils';
import { project } from '@/utils/constant';

function getColumns(list) {
  const arr = [
    {
      title: '抽检项目',
      width: 110,
      dataIndex: 'list_0',
      fixed: 'left',
    },
  ];
  for (let i = 0; i < project[0].length; i += 1) {
    arr.push({
      title: project[0][i],
      dataIndex: `list_${i + 1}`,
    });
  }
  return arr;
}

function getData(list) {
  const [obj1, obj2, obj3] = [
    {
      id: 1,
      list_0: '检测数',
    },
    { id: 2, list_0: '合格数' },
    { id: 3, list_0: '合格率（%）' },
  ];

  for (let i = 0; i < project[0].length; i += 1) {
    obj1[`list_${i + 1}`] = 0;
    obj2[`list_${i + 1}`] = 0;
    obj3[`list_${i + 1}`] = 0;
  }

  for (let i = 0; i < list.length; i += 1) {
    const index = project[0].indexOf(list[i].projectName);
    obj1[`list_${index + 1}`] = list[i].checkNum;
    obj2[`list_${index + 1}`] = list[i].passNum;
    obj3[`list_${index + 1}`] = list[i].passPercent * 100;
  }

  return [obj1, obj2, obj3];
}

export default {
  namespace: 'BuildSafetyRaw',

  state: {
    data: {
      list: [],
      columns: [],
    },
  },

  effects: {
    *rawmaterails({ payload }, { call, put }) {
      const response = yield call(getRawmaterails, payload);
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

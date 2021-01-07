/**
 * @description 路政 统计服务
 */
import { filterResponse } from '@/utils/utils';
import {
  getDynamicOverLimitTop5,
  getBusFocusTop,
  getOverCount,
  getSiteView,
  getAxleCount,
  getOverLimitCount,
  getOverRangCount,
  getBigScreenLawDataCount,
  getMobileCount,
} from '@/services/traffic/api-v2/countService';

import {
  getAxleCount as getAxleCountState,
  getOverLimitCount as getOverLimitCountState,
} from '@/services/chartStatistics';

const typeName = ['时', '日', '月', '年']; // 类型

function formData(list) {
  return list.map((item, i) => ({ ...item, id: i + 1 }));
}

function sum(data, field) {
  let count = 0;
  for (let i = 0; i < data.length; i += 1) {
    count += parseInt(data[i][field], 10);
  }
  return count;
}

/**
 * @description  数据统计-超限 table 动态生成
 * @param {*} data
 * @param {*} dateType
 */
function getColumns(data, dateType) {
  const columns = data.map((item, index) => ({
    key: index,
    title: `${dateType === 1 ? item.day.slice(0, 2) : item.day}${typeName[dateType - 1]}`,
    dataIndex: `total${index}`,
  }));
  columns.unshift({
    key: -1,
    width: 120,
    title: '检测类型',
    dataIndex: 'totalType',
    fixed: 'left',
  });
  columns.push({
    key: data.length,
    title: `${typeName[dateType]}统计`,
    dataIndex: 'totalCount',
  });
  return columns;
}

/**
 * @description 生成列表数据
 * @param {*} data
 */
function getTableData(data) {
  const list = [];
  const [totalCount, totalTrucksTotal, overTotalTotal] = [
    sum(data, 'total'),
    sum(data, 'totalTrucks'),
    sum(data, 'overTotal'),
  ];

  const [obj, obj2, obj3, obj4] = [
    { id: 0, totalType: '检测数(辆)' },
    { id: 1, totalType: '货车总数(辆)' },
    { id: 2, totalType: '货车超限数(辆)' },
    { id: 3, totalType: '货车超限率(%)' },
  ];
  for (let i = 0; i < data.length; i += 1) {
    const { total, totalTrucks, overTotal } = data[i];
    if (i + 1 === data.length) {
      obj.totalCount = totalCount;
      obj2.totalCount = totalTrucksTotal;
      obj3.totalCount = overTotalTotal;
      obj4.totalCount = totalTrucksTotal
        ? ((overTotalTotal / totalTrucksTotal) * 100).toFixed(2)
        : '0.00';
    }
    obj[`total${i}`] = total;
    obj2[`total${i}`] = totalTrucks;
    obj3[`total${i}`] = overTotal;
    obj4[`total${i}`] = totalTrucks ? ((overTotal / totalTrucks) * 100).toFixed(2) : '0.00';
  }

  list.push(obj);
  list.push(obj2);
  list.push(obj3);
  list.push(obj4);

  return list;
}

export default {
  namespace: 'TrafficApiV2Count',

  state: {
    dyTop5Data: [], // 动态Top5
    focusData: {
      carCount: [],
      overLoad: [],
    },
    bigScreenLawData: [],
    siteData: [],
    overData: [],
    axleData: [], // 轴型
    overLimitData: {
      data: [],
      columns: [],
      tableData: [],
    }, // 超限
    mobileData: {
      // 流动
      checkTotal: [],
      axleTotal: [],
      countByDayValue: [],
    },
    overRangData: { overRang: {}, overRangGroupByDay: [] }, // 幅度
  },

  effects: {
    // 首页 动态 top5
    *dynamicOverLimitTop5({ payload }, { call, put }) {
      const response = yield call(getDynamicOverLimitTop5, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'dyTopSave',
          payload: response.data,
        });
      }
    },
    // 大屏重点关注
    *busFocusTop(_, { call, put }) {
      const response = yield call(getBusFocusTop);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'focusDataSave',
          payload: response.data,
        });
      }
    },
    // 超限统计
    *overCount(_, { call, put }) {
      const response = yield call(getOverCount);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'overDateSave',
          payload: response.data,
        });
      }
    },
    // 站点统计
    *siteView(_, { call, put }) {
      const response = yield call(getSiteView);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'siteDataSave',
          payload: response.data,
        });
      }
    },
    // 数据统计-轴型
    *axleCount({ payload }, { call, put }) {
      let response = null;
      if (payload.origin === 2) {
        response = yield call(getAxleCountState, payload);
      } else {
        response = yield call(getAxleCount, payload);
      }
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'axleSave',
          payload: response.data,
        });
      }
    },
    // 数据统计-超限
    *overLimitCount({ payload }, { call, put }) {
      let response = null;
      if (payload.origin === 2) {
        response = yield call(getOverLimitCountState, payload);
      } else {
        response = yield call(getOverLimitCount, payload);
      }
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'overLimitSave',
          payload: { data: response.data, dateType: payload.dateType },
        });
      }
    },
    // 数据统计-幅度
    *overRangCount({ payload }, { call, put }) {
      const response = yield call(getOverRangCount, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'overRangSave',
          payload: response.data,
        });
      }
    },
    // 数据统计 - 流动
    *mobileCount({ payload }, { call, put }) {
      const response = yield call(getMobileCount, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'mobileSave',
          payload: response.data,
        });
      }
    },
    //
    *bigScreenLawDataCount({ _, callback }, { call, put }) {
      const response = yield call(getBigScreenLawDataCount);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'bigScreenLawDataCountSave',
          payload: response.data,
        });
        callback();
      }
    },
  },

  reducers: {
    // 动态Top5
    dyTopSave(state, action) {
      return {
        ...state,
        dyTop5Data: formData(action.payload),
      };
    },
    // 重点关注
    focusDataSave(state, action) {
      const { carCount, overLoad } = action.payload;
      return {
        ...state,
        focusData: {
          carCount: formData(carCount),
          overLoad: formData(overLoad),
        },
      };
    },
    // 超限统计
    overDateSave(state, action) {
      return { ...state, overData: action.payload };
    },
    // 站点统计
    siteDataSave(state, action) {
      return { ...state, siteData: formData(action.payload) };
    },
    // 轴型
    axleSave(state, action) {
      return { ...state, axleData: action.payload };
    },
    // 超限
    overLimitSave(state, action) {
      const { data, dateType } = action.payload;
      return {
        ...state,
        overLimitData: {
          data,
          columns: getColumns(data, dateType),
          tableData: getTableData(data),
        },
      };
    },
    // 超限幅度
    overRangSave(state, action) {
      const { overRang, overRangGroupByDay } = action.payload;
      return { ...state, overRangData: { overRang, overRangGroupByDay } };
    },
    //
    bigScreenLawDataCountSave(state, action) {
      return { ...state, bigScreenLawData: action.payload };
    },
    mobileSave(state, action) {
      return {
        ...state,
        mobileData: action.payload,
      };
    },
  },
};

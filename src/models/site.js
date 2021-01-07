import {
  querySite,
  removeSite,
  addSite,
  updateSite,
  detailSite,
  getUnloadYardsBySiteId,
  updateUnloadYards,
  addUnloadYards,
  deleteUnloadYardsById,
  getUnloadGoodsForPage,
  addUnloadGoods,
  updateUnloadGoods,
  deleteUnloadGoodsByIds,
  getSysSiteBuildForPage,
  addSysSiteBuild,
  updateSysSiteBuild,
  deleteSysSiteBuildByIds,
  getMediaConfsBySiteCode,
  addMediaConf,
  deleteMediaConfById,
  getSiteByUserSite
} from '@/services/site';
import {filterResponse} from '@/utils/utils';

export default {
  namespace: 'Site',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    unloadYardsData: {
      list: [],
      pagination: {},
    },
    unloadGoods: {
      list: [],
      pagination: {},
    },
    sysSiteBuild: {
      list: [],
      pagination: {},
    },
    modiaData: {
      list: []
    },
    detail: {},
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(querySite, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({payload, callback}, {call, put}) {
      const response = yield call(addSite, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * remove({payload, callback}, {call, put}) {
      const response = yield call(removeSite, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * update({payload, callback}, {call, put}) {
      const response = yield call(updateSite, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * detail({payload, callback}, {call, put}) {
      const response = yield call(detailSite, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        if (callback) callback(response.data || {});
      }
    },

    // 卸货场景
    * getUnloadYards({payload, callback}, {call, put}) {
      const response = yield call(getUnloadYardsBySiteId, payload);
      filterResponse(response);
      yield put({
        type: 'saveUnloadYards',
        payload: response,
      });
    },
    * updateUnloadYard({payload, callback}, {call, put}) {
      const response = yield call(updateUnloadYards, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * addUnloadYard({payload, callback}, {call, put}) {
      const response = yield call(addUnloadYards, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * deleteUnloadYard({payload, callback}, {call, put}) {
      const response = yield call(deleteUnloadYardsById, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    // 货物
    * getUnloadGoods({payload, callback}, {call, put}) {
      const response = yield call(getUnloadGoodsForPage, payload);
      filterResponse(response);
      yield put({
        type: 'saveUnloadGoods',
        payload: response.data,
      });
    },
    * addGoods({payload, callback}, {call, put}) {
      const response = yield call(addUnloadGoods, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * updateGoods({payload, callback}, {call, put}) {
      const response = yield call(updateUnloadGoods, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * deleteGoods({payload, callback}, {call, put}) {
      const response = yield call(deleteUnloadGoodsByIds, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    // 站点建设详情
    * getSysSiteBuild({payload, callback}, {call, put}) {
      const response = yield call(getSysSiteBuildForPage, payload);
      filterResponse(response);
      yield put({
        type: 'saveSysSiteBuild',
        payload: response.data,
      });
    },
    * addSysSiteBuildMsg({payload, callback}, {call, put}) {
      const response = yield call(addSysSiteBuild, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * updateSysSiteBuildMsg({payload, callback}, {call, put}) {
      const response = yield call(updateSysSiteBuild, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * deleteSysSiteBuildMsg({payload, callback}, {call, put}) {
      const response = yield call(deleteSysSiteBuildByIds, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    // 流媒体通道
    * getMedia({payload, callback}, {call, put}) {
      const response = yield call(getMediaConfsBySiteCode, payload);
      filterResponse(response);
      yield put({
        type: 'saveModiaData',
        payload: response
      })
    },
    * deleteMedia({payload, callback}, {call, put}) {
      const response = yield call(deleteMediaConfById, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * addMedia({payload, callback}, {call, put}) {
      const response = yield call(addMediaConf, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },

    // 根据机构编码获取关注站点
    * siteByUserSite({payload, callback}, {call, put}) {
      const response = yield call(getSiteByUserSite, payload);
      callback && callback(response);
    }
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
    saveUnloadYards(state, action) {
      return {
        ...state,
        unloadYardsData: {
          list: action.payload.data,
          pagination: {
            total: 0,
            pageSize: 0,
            current: 0,
          },
        },
      };
    },
    saveUnloadGoods(state, action) {
      return {
        ...state,
        unloadGoods: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
    saveSysSiteBuild(site, action) {
      return {
        ...site,
        sysSiteBuild: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
    saveModiaData(site, action) {
      return {
        ...site,
        modiaData: {
          list: action.payload.data
        }
      }
    },
    detailData(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};

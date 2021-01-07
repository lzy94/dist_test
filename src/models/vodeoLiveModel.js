import {
  getHLSLive,
  getChannelStream,
  getUserSite,
  getGBSPath,
  getTouch,
  LiveControl,
  LiveOpenYs7Url,
  LiveYs7Control,
  LiveYs7ControlStop,
} from '@/services/videoLiveService';

export default {
  namespace: 'Live',

  state: {
    siteList: [],
  },

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(getHLSLive, payload);
      callback && callback(response.EasyDarwin);
    },
    *channelstream({ payload, callback }, { call }) {
      const response = yield call(getChannelStream, payload);
      callback && callback(response.EasyDarwin);
    },
    *userSite({ payload, callback }, { call }) {
      const response = yield call(getUserSite, payload);
      callback && callback(response);
    },
    *GBSPath({ payload, callback }, { call }) {
      const response = yield call(getGBSPath, payload);
      if (typeof response === 'object') {
        callback && callback(response.HLS, response.FLV);
      }
    },
    *touch({ payload }, { call }) {
      yield call(getTouch, payload);
      // if (typeof response === 'object') {
      //   callback && callback(response.HLS);
      // }
    },
    *control({ payload }, { call }) {
      const status = yield call(LiveControl, payload);
      if (status === 'ok') {
        callback && callback();
      }
      // if (typeof response === 'object') {
      //   callback && callback(response.HLS);
      // }
    },
    *ys7Url({ payload, callback }, { call }) {
      const response = yield call(LiveOpenYs7Url, payload);
      // if (typeof response === 'object') {
      callback && callback(response);
      // }
    },
    *ys7Control({ payload, callback }, { call }) {
      const response = yield call(LiveYs7Control, payload);
      if (response.code === '200') {
        callback && callback(response);
      }
    },
    *ys7ControlStop({ payload, callback }, { call }) {
      const response = yield call(LiveYs7ControlStop, payload);
      if (response.code === '200') {
        callback && callback(response);
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        siteList: action.payload,
      };
    },
  },
};

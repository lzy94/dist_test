import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getHLSLive(params) {
  return request('/live/api/v1/getchannelstream?protocol=HLS', {
    params,
  });
}

// NVR 直播保活
export async function getChannelStream(params) {
  return request('/live/api/v1/touchchannelstream?protocol=HLS', {
    params,
  });
}

export async function getUserSite(params) {
  return request('/service/api/system/sysSite/getUserSite', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// GBS
// 开始直播
export async function getGBSPath(params) {
  return request('/liveGBS/api/v1/stream/start', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 实时直播 - 直播流保活
export async function getTouch(params) {
  return request('/liveGBS/api/v1/stream/touch', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// GBS 云台
export async function LiveControl(params) {
  return request('/liveGBS/api/v1/ptz/control', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 萤石 直播地址
export async function LiveOpenYs7Url(params) {
  return request('/ys7/api/lapp/live/address/get', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}
// 萤石 关闭直播
export async function LiveCloseYs7(params) {
  return request('/ys7/api/lapp/live/video/close', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 萤石 云台
export async function LiveYs7Control(params) {
  return request('/ys7/api/lapp/device/ptz/start', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

//  萤石 云台
export async function LiveYs7ControlStop(params) {
  return request('/ys7/api/lapp/device/ptz/stop', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

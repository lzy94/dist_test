import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getList(params) {
  return request('/maritime/api/sea/waterMonitoringPoint/list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function delPoint(params) {
  return request('/maritime/api/sea/waterMonitoringPoint/delPort', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addPoint(params) {
  return request('/maritime/api/sea/waterMonitoringPoint/addPoint', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function updatePoint(params) {
  return request('/maritime/api/sea/waterMonitoringPoint/updatePoint', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function getDetail(params) {
  return request('/maritime/api/sea/waterMonitoringPoint/getPointInfoByCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 当天时段水位信息
export async function getPointInfoForDay(params) {
  return request('/maritime/api/sea/waterPointData/getPointInfoForDay', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 根据检测点位编号查看监测点最新水位
export async function getPointInfoByCode(params) {
  return request('/maritime/api/sea/waterPointData/getPointInfoByCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function getWaterMonitoringPointPointInfoByCode(params) {
  return request('/maritime/api/sea/waterMonitoringPoint/getPointInfoByCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 监测点点位水位列表
export async function getWaterPoint(params) {
  return request('/maritime/api/sea/waterPointData/list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

// 水位列表
export async function getWaterList(params) {
  return request('/maritime/api/sea/waterPointData/waterList', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getList(params) {
  return request('/conserve/api/sea/RoadMonitoringPoint/list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function delPoint(params) {
  return request('/conserve/api/sea/RoadMonitoringPoint/delPort', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addPoint(params) {
  return request('/conserve/api/sea/RoadMonitoringPoint/addPoint', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function updatePoint(params) {
  return request('/conserve/api/sea/RoadMonitoringPoint/updatePoint', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function getDetail(params) {
  return request('/conserve/api/sea/RoadMonitoringPoint/getPointInfoByCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 当天时段水位信息
export async function getPointInfoForDay(params) {
  return request('/conserve/api/sea/roadPointData/getPointInfoForDay', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 根据检测点位编号查看监测点最新水位
export async function getPointInfoByCode(params) {
  return request('/conserve/api/sea/roadPointData/getPointInfoByCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 监测点点位水位列表
export async function getWaterPoint(params) {
  return request('/conserve/api/sea/roadPointData/list', {
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
  return request('/conserve/api/sea/roadPointData/waterList', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

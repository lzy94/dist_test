/**
 * @description 车辆定位
 */
import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

function getToken() {
  return localStorage.getItem('carToken') || '';
}

export async function getCarGpsToken() {
  return request('/carApi/api/login', { method: 'POST' });
}

// 车辆完整信息查询;
export async function getVehicleInfoCompleteV21(params) {
  return request('/carApi/api/vehicleInfoCompleteV21', {
    method: 'POST',
    headers: {
      Authorization: `token ${getToken()}`,
    },
    data: params,
  });
}

// 车辆轨迹（车牌）查询
export async function getVHisTrack24(params) {
  return request('/carApi/api/vHisTrack24', {
    method: 'POST',
    headers: {
      Authorization: `token ${getToken()}`,
    },
    data: params,
  });
}

// 车辆最新位置（车牌+颜色）查询
export async function getOpGpVclPosColor(params) {
  return request('/carApi/api/opGpVclPosColor', {
    method: 'POST',
    headers: {
      Authorization: `token ${getToken()}`,
    },
    data: params,
  });
}

// 列表轨迹查询
export async function getVHisTrack(params) {
  return request('/carApi/api/vHisTrack', {
    method: 'POST',
    headers: {
      Authorization: `token ${getToken()}`,
    },
    data: params,
  });
}

// 车辆行驶证信息查询（车牌+颜色）
export async function getVQueryLicenseV2(params) {
  return request('/carApi/api/vQueryLicenseV2', {
    method: 'POST',
    headers: {
      Authorization: `token ${getToken()}`,
    },
    data: params,
  });
}

// 定位配置-------------------------------------

// 列表
export async function getList() {
  return request('/service-v2/api/list', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
    },
  });
}

// 新增 编辑
export async function updateData(params) {
  return request('/service-v2/api/save', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
    },
    data: params,
  });
}

// 删除
export async function delData(params) {
  return request(`/service-v2/api/remove/${params}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
    },
  });
}

// 详情
export async function getDeteil(params) {
  return request(`/service-v2/api/get/${params}`, {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
    },
  });
}

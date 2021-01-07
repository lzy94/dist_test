/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

// 案件状态数据
export async function getBigScreenData(params) {
  return request(`/service-v2/api/bus/dataCount/bigScreenData`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 案件状态数据
export async function getBigScreenDyLawCaseData(params) {
  return request(`/service-v2/api/bus/dataCount/bigScreenDyLawCaseData`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 动态执法数据
export async function getBigScreenDyLawData(params) {
  return request(`/service-v2/api/bus/dataCount/bigScreenDyLawData`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 站点设备状态
export async function getBigScreenSiteEquiment(params) {
  return request(`/service-v2/api/bus/dataCount/bigScreenSiteEquiment`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}


// 静态执法数据
export async function getBigScreenStaticLawData(params) {
  return request(`/service-v2/api/bus/dataCount/bigScreenStaticLawData`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 站点名称-经纬度
export async function getSiteList(params) {
  return request(`/service-v2/api/bus/dataCount/siteList`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 轴型
export async function getBigScreenAxleData(params) {
  return request(`/service-v2/api/bus/dataCount/bigScreenAxleData`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 人员执法概况
export async function getPersonnelLaw(params) {
  return request(`/service-v2/api/bus/dataCount/personnelLaw`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 站点建设概况
export async function getSiteOverview(params) {
  return request(`/service-v2/api/bus/dataCount/siteOverview`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 黑名单
export async function getBusDlack(params) {
  return request(`/service/api/system/dicDlack/busDlack`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

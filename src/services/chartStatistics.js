import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

// 概况
export async function getOverviewOfHomePage() {
  return request('/service-v2/api/bus/dataCount/overviewOfHomePage', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
  });
}

// 轴型统计
export async function getAxleCount(params) {
  return request('/service-v2/api/bus/dataCount/axleCount', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 超限率统计
export async function getOverLimitCount(params) {
  return request('/service-v2/api/bus/dataCount/overLimitCount', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 超速率统计
export async function getOverSpeedCount(params) {
  return request('/service-v2/api/bus/dataCount/overSpeedCount', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 执法统计
export async function lawCountData(params) {
  return request('/service-v2/api/bus/dataCount/lawCount', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 超限幅统计
export async function overRangeCountData(params) {
  return request('/service-v2/api/bus/dataCount/overRangeCount', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}


//  新API 
// 检测概况 
export async function getCountTwelveMData(params) {
  return request('/service-v2/api/bus/dataCount/countTwelveMData', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 动态检测今日超限统计
export async function getDyCountByNow(params) {
  return request('/service-v2/api/bus/dataCount/dyCountByNow', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 静态检测今日超限统计
export async function getStaticCountByNow(params) {
  return request('/service-v2/api/bus/dataCount/staticCountByNow', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

// 非现场近12月检测数据统计
export async function getCountDataForYear(params) {
  return request('/service-v2/api/bus/dataCount/countDataForYear', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}
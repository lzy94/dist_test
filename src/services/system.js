import request from '@/utils/request';
import { getLocalStorage } from '../utils/utils';

/**
 * 获得树形行政区域
 * @returns {Promise<void>}
 */
export async function getTree(params) {
  return request('/result/base/tools/v1/getCityTree', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function getPinyin(params) {
  return request('/result/base/tools/v1/getPinyin', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function getMenuTree() {
  return request('/result/api/uc/sysMenu/getTree', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getUserSite(params) {
  return request('/result/api/uc/user/getUserSite?siteType=' + params.siteType, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {},
  });
}

export async function getWarningMsgNotDu(params) {
  return request('/service-v2/api/bus/busDynamicData/warningMsgNotDu', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}


// 路政  获取相关人员
export async function getDepartmentUser(params) {
  return request('/conserve/api/complex/contingencyPlan/getDepartmentUser', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}


// 紧急事件
export async function contingencyControlForPage(params) {
  return request('/conserve/api/complex/contingencyFeedback/contingencyControlForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}


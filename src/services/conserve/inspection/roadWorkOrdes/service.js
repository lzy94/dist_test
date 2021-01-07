import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';
import { async } from '@/assets/pdf.worker';

export async function queryList(params) {
  return request('/conserve/complex/roadWorkOrdes/v1/list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function saveRoadWorkOrdes(params) {
  return request('/conserve/complex/roadWorkOrdes/v1/save', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getDetail(params) {
  return request(`/conserve/complex/roadWorkOrdes/v1/getCompanyOrder/${params}`, {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function setOrderCompelete(params) {
  return request('/conserve/complex/roadWorkOrdes/v1/orderCompelete', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function getOrderByState() {
  return request('/conserve/complex/roadWorkOrdes/v1/orderByState', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function removeOrder(params) {
  return request('/conserve/complex/roadWorkOrdes/v1/removes', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 企业考核信息
export async function addExamineInfo(params) {
  return request('/conserve/api/complex/conserveExamine/addExamineInfo', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getExamineInforPage(params) {
  return request('/conserve/api/complex/conserveExamine/getExamineInforPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

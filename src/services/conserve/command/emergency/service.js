import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function contingencyControlForPage(params) {
  return request('/conserve/api/complex/contingencyControl/contingencyControlForPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function contingencyControlSend(params) {
  return request('/conserve/api/complex/contingencyControl/contingencyControlSend', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function getRoadContingencyControlById(params) {
  return request('/conserve/api/complex/contingencyControl/getRoadContingencyControlById', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addContingencyControl(params) {
  return request('/conserve/api/complex/contingencyControl/addContingencyControl', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

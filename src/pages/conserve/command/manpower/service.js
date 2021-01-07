import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function contingencyPersonControlForPage(params) {
  return request('/conserve/api/complex/contingencyControl/contingencyPersonControlForPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function addContingencyPersonControl(params) {
  return request('/conserve/api/complex/contingencyControl/addContingencyPersonControl', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getContingencyPersonControlById(params) {
  return request('/conserve/api/complex/contingencyControl/getContingencyPersonControlById', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function personControlComplete(params) {
  return request('/conserve/api/complex/contingencyControl/personControlComplete', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

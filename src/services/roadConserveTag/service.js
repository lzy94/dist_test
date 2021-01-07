import request from 'umi-request';
import { getLocalStorage } from '@/utils/utils';

export async function queryTag() {
  return request('/conserve/api/complex/roadConserveTag/getAll', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function removeTag(params) {
  return request('/conserve/api/complex/roadConserveTag/removes', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addTag(params) {
  return request('/conserve/api/complex/roadConserveTag/save', {
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

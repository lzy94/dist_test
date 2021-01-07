import request from 'umi-request';
import { getLocalStorage } from '@/utils/utils';

export async function getList(params) {
  return request('/maritime/api/sea/ships/list', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function delPort(params) {
  return request('/maritime/api/sea/ships/delPort', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addShips(params) {
  return request('/maritime/api/sea/ships/addShips', {
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

export async function updatePractitionerInfo(params) {
  return request('/maritime/api/sea/ships/updatePractitionerInfo', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getList(params) {
  return request('/transport/transportAdmin/practitionersCar/v1/list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function removeData(params) {
  return request('/transport/transportAdmin/practitionersCar/v1/removes', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function saveData(params) {
  return request('/transport/transportAdmin/practitionersCar/v1/save', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function importCarInfo(params) {
  return request('/transport/transportAdmin/practitionersCar/v1/importCarInfo', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

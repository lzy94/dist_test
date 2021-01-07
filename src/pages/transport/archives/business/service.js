import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getList(params) {
  return request('/transport/api/tsAdmin/businessInfo/getforPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function removeData(params) {
  return request(`/transport/api/tsAdmin/businessInfo/remove/${params}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addData(params) {
  return request('/transport/api/tsAdmin/businessInfo/add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function updateData(params) {
  return request('/transport/api/tsAdmin/businessInfo/update', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function importBusinesInfo(params) {
  return request('/transport/api/tsAdmin/businessInfo/importBusinesInfo', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryList(params) {
  return request('/conserve/complex/roadSendPhone/v1/list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function addOrSave(params) {
  return request('/conserve/complex/roadSendPhone/v1/save', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}


export async function testSend(params) {
  return request('/conserve/complex/roadSendPhone/v1/sendMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

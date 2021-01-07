import request from '@/utils/request';
import {getLocalStorage} from "@/utils/utils";

export async function fakeAccountLogin(params) {
  return request('/result/auth', {
    method: 'POST',
    data: params,
  });
}

export async function isTokenExpired() {
  return request('/result/isTokenExpired?token=' + getLocalStorage('token')[0], {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
  })
}

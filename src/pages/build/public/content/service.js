import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryData(params) {
  return request('/build/maritimeAffairs/buildPublicContent/v1/list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function removeDatas(params) {
  return request('/build/maritimeAffairs/buildPublicContent/v1/removes', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addAndUpdate(params) {
  return request('/build/maritimeAffairs/buildPublicContent/v1/save', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function getDetail(params) {
  return request(`/build/maritimeAffairs/buildPublicContent/v1/get/${params}`, {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

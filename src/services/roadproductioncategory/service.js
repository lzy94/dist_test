import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryList(params) {
  return request('/conserve/complex/roadProductionCategory/v1/list', {
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

export async function removeList(params) {
  return request(`/conserve/complex/roadProductionCategory/v1/remove/${params}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function removeLists(params) {
  return request('/conserve/complex/roadProductionCategory/v1/removes', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}


export async function saveList(params) {
  return request('/conserve/complex/roadProductionCategory/v1/save', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getDetail(params) {
  return request(`/conserve/complex/roadProductionCategory/v1/get/${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

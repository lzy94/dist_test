import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getList(params) {
  return request('/conserve/complex/roadProductionTrouble/v1/list', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getDetail(params) {
  return request(`/conserve/complex/roadProductionTrouble/v1/get/${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function changeState(params) {
  return request('/conserve/complex/roadProductionTrouble/v1/change', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function listPlanCategory(params) {
  return request('/conserve/api/complex/planCategory/listPlanCategory', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function deletePlanCategory(params) {
  return request('/conserve/api/complex/planCategory/deletePlanCategory', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addPlanCategory(params) {
  return request('/conserve/api/complex/planCategory/addPlanCategory', {
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

export async function updatePlanCategory(params) {
  return request('/conserve/api/complex/planCategory/updatePlanCategory', {
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

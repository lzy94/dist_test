import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryList(params) {
  return request('/conserve/api/complex/contingencyPlan/contingencyPlanForPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function removeList(params) {
  return request('/conserve/api/complex/contingencyPlan/delContingencyPlanById', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addList(params) {
  return request('/conserve/api/complex/contingencyPlan/addContingencyPlan', {
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

export async function updateList(params) {
  return request('/conserve/api/complex/contingencyPlan/updateContingencyPlan\n', {
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

import request from 'umi-request';
import { getLocalStorage } from '@/utils/utils';

export async function roadElectronictagReocdForPage(params) {
  return request('/conserve/api/complex/electronictag/roadElectronictagReocdForPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getByProductionCode(params) {
  return request('/conserve/complex/roadProduction/v1/getByProductionCode', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}


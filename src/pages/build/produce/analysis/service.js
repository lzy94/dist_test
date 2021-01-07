import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getRawmaterails(params) {
  return request('/build/buildSupervise/buildSafetyProduceAnalysis/v1/list/rawmaterails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function getUnitproject(params) {
  return request('/build/buildSupervise/buildSafetyProduceAnalysis/v1/list/unitproject', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

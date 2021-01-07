import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getRoadCount() {
  return request('/conserve/complex/GeneralCount/v1/roadCount', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getOtherCount() {
  return request('/conserve/complex/GeneralCount/v1/otherCount', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getAllByLevel() {
  return request('/conserve/api/complex/contingencyControl/getAllByLevel', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

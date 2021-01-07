import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getFocusList() {
  return request('/maritime/maritimeAffairs/bigData/v1/focus', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getMonitorScale(params) {
  return request('/maritime/maritimeAffairs/bigData/v1/monitorScale', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

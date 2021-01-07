import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

// 点位
export async function getList(params) {
  return request('/maritime/api/sea/waterMonitoringPoint/list', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getPointInfoForDay(params) {
  return request('/maritime/api/sea/waterPointData/getPointInfoForDay', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function getPointInfoByCode(params) {
  return request('/maritime/api/sea/waterPointData/getPointInfoByCode', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

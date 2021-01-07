import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getMonitorPage(params) {
  return request('/conserve/api/monitor/getMonitorPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function removeMonitor(params) {
  return request(`/conserve/api/monitor/delete/${params}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addMonitor(params) {
  return request('/conserve/api/monitor/addMonitor', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function updateMonitor(params) {
  return request('/conserve/api/monitor/updateMonitor', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function updateRelay(params) {
  return request('/conserve/api/monitor/updateRelay', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryBlacklist(params) {
  return request('/service/api/system/dicDlack/getDicBlackForPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: { ...params }
  });
}

export async function removeBlacklist(params) {
  return request('/service/api/system/dicDlack/deleteDicBliackByIds', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,
  });
}

export async function addBlacklist(params) {
  return request('/service/api/system/dicDlack/addDicBlackList', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {
      ...params,
    },
  });
}

export async function updateBlacklist(params) {
  return request('/service/api/system/dicDlack/updateDicBlackList', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {
      ...params,
    },
  });
}

export async function getBlacklistDetail(params) {
  return request(`/service/api/system/dicDlack/getDicBliack/${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
  });
}

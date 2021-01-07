import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryOrg(params) {
  return request(`/result/api/uc/sysOrgan/organListForPage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function removeOrg(params) {
  return request('/result/api/uc/sysOrgan/deleteOrgById', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addOrg(params) {
  return request('/result/api/uc/sysOrgan/organAdd', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function updateOrg(params) {
  return request('/result/api/uc/sysOrgan/organUpdate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function getOrganById(params) {
  return request('/result/api/uc/sysOrgan/getOrganById', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getList(params) {
  return request('/transport/api/tsAdmin/companyLicence/getForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function removeData(params) {
  return request(`/transport/api/tsAdmin/companyLicence/remove/${params}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function addData(params) {
  return request('/transport/api/tsAdmin/companyLicence/add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function updateData(params) {
  return request('/transport/api/tsAdmin/companyLicence/update', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

export async function importCompanyLicence(params) {
  return request('/transport/api/tsAdmin/companyLicence/importCompanyLicence', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';


export async function getEquipmentForPage(params) {
  return request('/service-v2/api/LawEmforcementEquipment/getEquipmentForPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

export async function addEquipment(params) {
  return request('/service-v2/api/LawEmforcementEquipment/addEquipment', {
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

export async function updateEquipment(params) {
  return request('/service-v2/api/LawEmforcementEquipment/updateEquipment', {
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

export async function deleteEquipment(params) {
  return request('/service-v2/api/LawEmforcementEquipment/deleteEquipment', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,
  });
}

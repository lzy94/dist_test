import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function getTrainForPage(params) {
  return request('/service-v2/api/lawEmforcementTrain/getTrainForPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

export async function deleteTrain(params) {
  return request('/service-v2/api/lawEmforcementTrain/deleteTrain', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,
  });
}

export async function addTrain(params) {
  return request('/service-v2/api/lawEmforcementTrain/addTrain', {
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

export async function updateTrain(params) {
  return request('/service-v2/api/lawEmforcementTrain/updateTrain', {
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

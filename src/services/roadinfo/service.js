import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';


export async function getRoadInfoPage(params) {
  return request('/conserve/api/complex/roadInfo/getRoadInfoPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function deleteRoadInfoByIds(params) {
  return request('/conserve/api/complex/roadInfo/deleteRoadInfoByIds', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addRoadInfo(params) {
  return request('/conserve/api/complex/roadInfo/addRoadInfo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}


export async function updateRoadInfo(params) {
  return request('/conserve/api/complex/roadInfo/updateRoadInfo', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}


export async function getDetail(params) {
  return request(`/conserve/api/complex/roadInfo/get/${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function setRoadFocuseInfo(params) {
  return request('/conserve/api/complex/roadInfo/setRoadFocuseInfo', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}



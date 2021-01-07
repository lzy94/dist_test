import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function querySystemUserList(params) {
  return request(`/result/api/uc/user/getUserPage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {
      ...params,
      // method:'post'
    }
  });
}

export async function removeSystemUser(params) {
  return request('/result/api/uc/user/deleteUserByIds', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,
  });
}

export async function addSystemUser(params) {
  return request('/result/api/uc/user/addUser', {
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


export async function getUserDetail(params) {
  return request('/result/api/uc/user/getUser', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,

  })
}

export async function updateSystemUser(params) {
  return request('/result/api/uc/user/updateUser', {
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

export async function activateUser(params) {
  return request('/result/api/uc/user/activateUser', {
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

export async function forbiddenUser(params) {
  return request('/result/api/uc/user/forbiddenUser', {
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

export async function importData(params) {
  return request('/result/api/uc/user/exportUsers?isAll=true', {
    method: 'POST',
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {
      ...params,
    },
  })
}


export async function updateUserInfo(params) {
  return request('/result/api/uc/user/updateUserInfo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {
      ...params,
    },
  })
}

export async function getUserLawLogs(params) {
  return request('/service-v2/api/busDynamicLogs/v1/getUserLawLogs', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  })
}

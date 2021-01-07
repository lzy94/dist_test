import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryList(params) {
  return request('/service-v2/api/LawsAndRegulations/v1/getAllForPage', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

export async function addData(params) {
  return request('/service-v2/api/LawsAndRegulations/v1/addLawsAndRegulations', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

export async function deleteData(params) {
  return request('/service-v2/api/LawsAndRegulations/v1/remove', {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

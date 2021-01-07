import request from '@/utils/request';
import {getLocalStorage} from "@/utils/utils";

export async function getList(params) {
  return request('/service-v2/api/bus/busMobileLawData/list', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

export async function getDetail(params) {
  return request('/service-v2/api/bus/busMobileLawData/getOne', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,
  });
}

export async function setExaminationPassed(params) {
  return request('/service-v2/api/bus/busMobileLawData/examinationPassed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,
  });
}

export async function templateDownload(params) {
  return request('/service-v2/api/bus/busMobileLawData/templateDownload', {
    method: 'POST',
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params,
  });
}

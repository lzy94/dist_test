import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryFile(params) {
  return request('/result/api/file/v1/list', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {
      ...params
    }
  });
}

export async function downloadFile(params) {
  return request(`/result/api/file/v1/downloadFile?fileId=${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    responseType: 'blob',
  });

}


export async function removeFile(params) {
  return request('/result/api/file/v1/remove', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: params,
  });
}

export async function getDetail(params) {
  return request('/result/api/file/v1/fileGet', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: params,
  });
}

export async function getPreview(params) {
  return request('/result/file/onlinePreviewController/v1/onlinePreview', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  })
}

export async function getPreview_(params) {
  return request(`/result/file/onlinePreviewController/v1/${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
  })
}

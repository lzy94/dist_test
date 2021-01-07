import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryStatic(params) {
  return request('/service-v2/api/bus/busStaticData/busDynamicDataForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {...params},
  });
}

export async function getBusDynamicData(params) {
  return request('/service-v2/api/bus/busStaticData/getBusDynamicData', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function setInvalidData(params) {
  return request('/service-v2/api/bus/busStaticData/invalidData', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 审核通过
export async function setExaminationPassed(params) {
  return request('/service-v2/api/bus/busStaticData/examinationPassed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params
  })
}

// 复审通过
export async function setReviewPassed(params) {
  return request('/service-v2/api/bus/busStaticData/reviewPassed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params
  })
}

// 签批
export async function setSigningPassed(params) {
  return request('/service-v2/api/bus/busStaticData/signingPassed', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params
  })
}

// 模板打印
export async function getTemplateDownload(params) {
  return request('/service-v2/api/bus/busStaticData/templateDownload', {
    method: 'POST',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params
  })
}

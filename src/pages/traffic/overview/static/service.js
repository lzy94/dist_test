import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryStatic(params) {
  return request('/service-v2/api/bus/busStaticData/busDynamicDataForPage', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

export async function getBusDynamicData(params) {
  return request('/service-v2/api/bus/busStaticData/getBusDynamicData', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  })
}

export async function exportBusStaticData(params) {
  return request('/service-v2/api/bus/busStaticData/exportBusStaticData?isAll=true', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    responseType: 'blob',
    data: {...params}
  })
}

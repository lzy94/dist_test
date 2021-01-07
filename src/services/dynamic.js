import request from '@/utils/request';
import {getLocalStorage} from "../utils/utils";

export async function queryData(params) {
  return request(`/service-v2/api/bus/busDynamicData/busDynamicDataForPage`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

export async function getDynamicDataById(params) {
  return request("/service-v2/api/bus/busDynamicData/getDynamicDataById", {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  })
}

export async function exportBusDynamicData(params) {
  return request('/service-v2/api/bus/busDynamicData/exportBusDynamicData?isAll=true', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    responseType: 'blob',
    data: {...params}
  })
}

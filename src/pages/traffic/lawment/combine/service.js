import request from '@/utils/request';
import {getLocalStorage} from "@/utils/utils";

export async function queryCompare(params) {
  return request('/service-v2/api/bus/busStaticData/dynamicAndStaticCompare', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    data: {...params}
  });
}

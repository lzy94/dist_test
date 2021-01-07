import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryData(params) {
  return request(`/service-v2/api/equiment/log/busDynamicDataForPage?type=${params.type}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

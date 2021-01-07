import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

// eslint-disable-next-line import/prefer-default-export
export async function queryData(params) {
  return request('/build/buildSupervise/buildConditionAnalysis/v1/list/rawmaterails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

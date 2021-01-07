import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getCorporateInfo() {
  return request('/transport/TransportAdmin/bigData/v1/corporateInfo', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getCompanySort() {
  return request('/transport/TransportAdmin/bigData/v1/companySort', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

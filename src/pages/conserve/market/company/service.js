import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getFocusRoadInfo() {
  return request('/conserve/complex/GeneralCount/v1/focusRoadInfo', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getCompanyInfo(roadId) {
  return request(`/conserve/complex/GeneralCount/v1/companyInfo/${roadId}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

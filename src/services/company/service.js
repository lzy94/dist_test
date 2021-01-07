import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryCompany(params) {
  return request('/conserve/api/complex/RoadConserveCompany/getRoadConserveCompanyPage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function removeCompany(params) {
  return request('/conserve/api/complex/RoadConserveCompany/deleteCompanyByIds', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addCompany(params) {
  return request('/conserve/api/complex/RoadConserveCompany/addRoadConserveCompany', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function updateCompany(params) {
  return request('/conserve/api/complex/RoadConserveCompany/updateRoadConserveCompany', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function getDetail(params) {
  return request(`/conserve/api/complex/RoadConserveCompany/get/${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}




export async function addCompanyRoadConserve(params) {
  return request('/conserve/api/complex/RoadCompanyConserve/addCompanyRoadConserve', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function deleteCompanyRoadConserveById(params) {
  return request('/conserve/api/complex/RoadCompanyConserve/deleteById', {
    method:'DELETE',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function getCompanyInfos(params) {
  return request(`/conserve/api/complex/RoadCompanyConserve/getCompanyInfos/${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getRoadInfos(params) {
  return request(`/conserve/api/complex/RoadCompanyConserve/getRoadInfos/${params}`, {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

export async function getAllRoadCompanyConserve(params) {
  return request('/conserve/api/complex/RoadCompanyConserve/list', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

import request from '@/utils/request';
import {getLocalStorage} from "@/utils/utils";


export async function getDynamicOverLimitTop5(params) {
  return request('/service-v2/api/bus/dataCount/dynamicOverLimitTop5', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

export async function getStaticOverLimitTop5(params) {
  return request('/service-v2/api/bus/dataCount/staticOverLimitTop5', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  });
}

export async function getAllSite(params) {
  return request('/service-v2/api/map/v1/getAllSite', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  })
}

export async function getSiteAndCount(params) {
  return request('/service-v2/api/map/v1/getSiteAndCount', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  })
}


export async function getCompanyAndCount(params) {
  return request('/service-v2/api/map/v1/getCompanyAndCount', {
    headers: {
      'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest'
    },
    params
  })

}

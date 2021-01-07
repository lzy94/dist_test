/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

// 养护统计
export async function getConserveCount() {
  return request('/conserve/complex/bigData/v1/conserveCount', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

// 企业评分
export async function getCompanyScore() {
  return request('/conserve/complex/bigData/v1/companyScore', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

// 企业评分
export async function getElectroLabel() {
  return request('/conserve/complex/bigData/v1/electroLabel', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });
}

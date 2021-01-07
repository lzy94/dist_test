import { getLocalStorage } from '@/utils/utils';
/**
 * @description 路政 统计服务
 */
import request from '@/utils/request';

// 首页 GIS 动态 Top5
export async function getDynamicOverLimitTop5(params) {
  return request(`/traffic-v1/api/bus/count/dynamicOverLimitTop5/${params}`);
}

// 大屏数据 动态
export async function getBigScreenLawDataCount() {
  return request('/traffic-v1/api/bus/count/bigScreenLawDataCount', {
    method: 'POST',
  });
}

// 大屏数据
// 重点关注
export async function getBusFocusTop() {
  return request('/traffic-v1/api/bus/count/screen/busFocusTop');
}

// 超限统计
export async function getOverCount() {
  return request('/traffic-v1/api/bus/count/screen/overCount');
}

// 站点概况
export async function getSiteView() {
  return request('/traffic-v1/api/bus/count/screen/siteView');
}

// 数据统计-轴型统计
export async function getAxleCount(params) {
  return request('/traffic-v1/api/bus/count/count/axleCount', {
    method: 'POST',
    data: params,
  });
}

// 数据统计-超限统计
export async function getOverLimitCount(params) {
  return request('/traffic-v1/api/bus/count/count/overLimitCount', {
    method: 'POST',
    data: params,
  });
}

// 数据统计-超限幅度统计
export async function getOverRangCount(params) {
  return request('/traffic-v1/api/bus/count/count/overRangCount', {
    method: 'POST',
    data: params,
  });
}

// 数据统计
export async function getMobileCount(params) {
  return request('/service-v2/api/bus/busMobileLawData/mobileCount', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 未读预检信息统计
export async function getWarningMsgNotDu(params) {
  return request('/traffic-v1/api/bus/count/warningMsgNotDu', {
    method: 'POST',
    data: params,
  });
}

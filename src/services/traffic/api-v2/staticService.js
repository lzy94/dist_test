/**
 * @description 静态检测数据
 */

import request from '@/utils/request';

// 新增静态检测数据
export async function busStaticData(params) {
  return request('/traffic-v1/api/bus/busStaticData/busStaticData', {
    method: 'POST',
    data: params,
  });
}

// 动静结合数据
export async function getDynamicAndStaticCompare(params) {
  return request('/traffic-v1/api/bus/busStaticData/dynamicAndStaticCompare', {
    method: 'POST',
    data: params,
  });
}

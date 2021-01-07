/**
 * @description 路政 检测数据服务
 */

import request from '@/utils/request';

// 动态检测数据
export async function getBusDynamicDataForPage(params) {
  return request('/traffic-v1/api/bus/busDynamicData/busDynamicDataForPage', {
    method: 'POST',
    data: params,
  });
}

// 根据ID 查询检测数据详情
export async function getDynamicDataById(params) {
  return request(`/traffic-v1/api/bus/busDynamicData/getDynamicDataById/${params}`);
}

// 重点关注
export async function getFocusData(params) {
  return request('/traffic-v1/api/bus/busDynamicData/focusData', {
    method: 'POST',
    data: params,
  });
}

// 案件退回重审
export async function toLawCaseReturn(params) {
  return request('/traffic-v1/api/bus/busDynamicData/lawCaseReturn', {
    method: 'PUT',
    data: params,
  });
}

// 撤销处罚
export async function fromLawCaseRevoke(params) {
  return request('/traffic-v1/api/bus/busDynamicData/lawCaseRevoke', {
    method: 'POST',
    data: params,
  });
}

// 超限数据推送交警录入车辆信息
export async function toSubmitEntry(params) {
  return request(`/traffic-v1/api/bus/busDynamicData/submitEntry?id=${params.id}`, {
    method: 'POST',
    // data: params,
  });
}

// 初审通过
export async function toVerifyPass(params) {
  return request('/traffic-v1/api/bus/busDynamicData/verifyPass', {
    method: 'POST',
    data: params,
  });
}

// 证据保存成功后更改检测数据状态
export async function setAfterRegister(params) {
  return request(`/traffic-v1/api/bus/busDynamicData/afterRegister/${params}`);
}

// 动态检测数据导出
export async function busDynamicDataExport(params) {
  return request(`/traffic-v1/api/bus/busDynamicData/busDynamicDataExport`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}

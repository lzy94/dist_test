import { async } from '@/assets/pdf.worker';
import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function queryDynamicLaw(params) {
  return request('/service-v2/api/bus/busDynamicLawData/getBusDynamicLawDataForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getBusDynamicLawData(params) {
  return request('/service-v2/api/bus/busDynamicLawData/getBusDynamicLawDataById', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function busOvertruckRegisterAdd(params) {
  return request('/service-v2/api/bus/busOvertruckRegister/busOvertruckRegisterAdd', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

export async function getBusDynamicLawDataByPreviewCode(params) {
  return request('/service-v2/api/bus/busDynamicLawData/getBusDynamicLawDataByPreviewCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 打印报告函
export async function getPrintLetter(params) {
  return request('/service-v2/api/bus/busDynamicLawData/getPrintLetter', {
    method: 'POST',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 无效数据
export async function setInvalidData(params) {
  return request(`/service-v2/api/bus/busDynamicLawData/invalidData`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 初级审核
export async function setVerifyPass(params) {
  return request('/service-v2/api/bus/busDynamicLawData/verifyPass', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 重点关注
export async function setFocusData(params) {
  return request(
    `/service-v2/api/bus/busDynamicLawData/focusData?previewCode=${params.previewCode}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      data: { ...params },
    },
  );
}

// 退回重审
export async function setLawCaseReturn(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/lawCaseReturn', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 撤销处罚
export async function setLawCaseRevoke(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/lawCaseRevoke', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

// 案件办结
export async function setLawCaseClose(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/lawCaseClose', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 案件信息登记
export async function setLawCaseRegist(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/lawCaseRegist', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

// 卷宗模版打印
export async function getFilePrint(params) {
  return request(`/service-v2/api/bus/busDynamicLawCase/getFilePrint`, {
    method: 'POST',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 根据预检序号查询案件信息
export async function getLawCaseByPreviewCode(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/getLawCaseByPreviewCode', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 案件归档 列表
export async function getBusDynamicLawCaseForPage(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/getBusDynamicLawCaseForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

// 卷宗上传
export async function jzUploadFile(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/filePrintUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 案件归档
export async function sendCaseArchive(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/caseArchive', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 车辆信息
export async function getOvertruckRegisterInfo(params) {
  return request('/service-v2/api/bus/busOvertruckRegister/getOvertruckRegisterInfo', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 无效数据
export async function getBusInvalidDataForPage(params) {
  return request('/service-v2/api/bus/BusInvalidData/getBusInvalidDataForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

// 免处罚数据
export async function getBusPenaltyDataForPage(params) {
  return request('/service-v2/api/bus/busPenaltyData/getBusPenaltyDataForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

// 重点关注车辆
export async function getBusDynamicFocusForPage(params) {
  return request('/service-v2/api/bus/busDynamicFocus/getBusDynamicFocusForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

// 批量删除
export async function deleteBusDynamicFocus(params) {
  return request('/service-v2/api/bus/busDynamicLawData/deleteFocus', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 数据导出
// 免处罚数据
export async function exportBusPenaltyData(params) {
  return request('/service-v2/api/bus/busPenaltyData/exportBusPenaltyData?isAll=true', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    responseType: 'blob',
    data: { ...params },
  });
}

// 无效数据
export async function exportBusInvalidData(params) {
  return request('/service-v2/api/bus/BusInvalidData/exportBusInvalidData?isAll=true', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    responseType: 'blob',
    data: { ...params },
  });
}

// 执法检测数据
export async function exportBusDynamicLawData(params) {
  return request('/service-v2/api/bus/busDynamicLawData/exportBusDynamicLawData?isAll=true', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    responseType: 'blob',
    data: { ...params },
  });
}

// 案卷数据
export async function exportBusDynamicLawCaseData(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/exportBusDynamicLawCase?isAll=true', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    responseType: 'blob',
    data: { ...params },
  });
}

// 模版打印附件列表
export async function getFileList(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/fileList', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: { ...params },
  });
}

// 案件签批通过
export async function setBatchPass(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/batchPass', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 签批 退回重审
export async function setBatchPassReturn(params) {
  return request('/service-v2/api/bus/busDynamicLawCase/batchPassReturn', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 提交数据到超限信息录入
export async function setSubmitEntry(params) {
  return request('/service-v2/api/bus/busDynamicLawData/submitEntry', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 法制审核人确认
export async function setReviewer(params) {
  return request(`/service-v2/api/bus/busDynamicLawCase/reviewer?previewCode=${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

// 案件管理人员确认
export async function setPrincipal(params) {
  return request(`/service-v2/api/bus/busDynamicLawCase/principal?previewCode=${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

// 发送短信
export async function sendMsgSms(params) {
  return request('/service-v2/api/bus/busDynamicLawData/sendBusSms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: params,
  });
}

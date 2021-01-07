/* eslint-disable no-unused-expressions */
import {
  queryDynamicLaw,
  getBusDynamicLawData,
  busOvertruckRegisterAdd,
  getPrintLetter,
  setInvalidData,
  setVerifyPass,
  setFocusData,
  setLawCaseReturn,
  setLawCaseRevoke,
  setLawCaseClose,
  setLawCaseRegist,
  getFilePrint,
  getLawCaseByPreviewCode,
  getOvertruckRegisterInfo,
  getBusInvalidDataForPage,
  getBusDynamicLawDataByPreviewCode,
  getBusPenaltyDataForPage,
  getBusDynamicFocusForPage,
  deleteBusDynamicFocus,
  getBusDynamicLawCaseForPage,
  jzUploadFile,
  sendCaseArchive,
  exportBusPenaltyData,
  exportBusInvalidData,
  exportBusDynamicLawData,
  exportBusDynamicLawCaseData,
  getFileList,
  setBatchPass,
  setBatchPassReturn,
  setSubmitEntry,
  setReviewer,
  setPrincipal,
  sendMsgSms,
} from '@/services/lawmentDynamic';
import { querySite } from '@/services/site';
import { filterResponse, downLoadFile } from '@/utils/utils';

export default {
  namespace: 'DynamicLaw',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDynamicLaw, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getBusDynamicLawData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data || { busDynamicLawDate: {}, registerInfo: {} });
      }
    },
    *getSite({ payload, callback }, { call }) {
      const response = yield call(querySite, payload);
      callback && callback(response.rows);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(busOvertruckRegisterAdd, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *printLetter({ payload, callback }, { call }) {
      const { carNo } = payload;
      delete payload.carNo;
      const response = yield call(getPrintLetter, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback(404);
      } else {
        downLoadFile(response, `${carNo}_告知函.doc`);
        callback();
      }
    },
    *invalidData({ payload, callback }, { call }) {
      const response = yield call(setInvalidData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *verifyPass({ payload, callback }, { call }) {
      const response = yield call(setVerifyPass, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *focusData({ payload, callback }, { call }) {
      const response = yield call(setFocusData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *lawCaseReturn({ payload, callback }, { call }) {
      const response = yield call(setLawCaseReturn, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *lawCaseRevoke({ payload, callback }, { call }) {
      const response = yield call(setLawCaseRevoke, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *lawCaseClose({ payload, callback }, { call }) {
      const response = yield call(setLawCaseClose, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *lawCaseRegist({ payload, callback }, { call }) {
      const response = yield call(setLawCaseRegist, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *filePrint({ payload, callback }, { call }) {
      const { carNo } = payload;
      delete payload.carNo;
      const response = yield call(getFilePrint, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback(404);
      } else {
        downLoadFile(response, `${carNo}_卷宗.doc`);
        callback();
      }
    },
    *getLawCase({ payload, callback }, { call }) {
      const response = yield call(getLawCaseByPreviewCode, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
      }
    },
    // 归档
    *getBusDynamicLawCase({ payload }, { call, put }) {
      const response = yield call(getBusDynamicLawCaseForPage, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *jzUpload({ payload, callback }, { call }) {
      const response = yield call(jzUploadFile, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *caseArchive({ payload, callback }, { call }) {
      const response = yield call(sendCaseArchive, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *overtruckRegisterInfo({ payload, callback }, { call }) {
      const response = yield call(getOvertruckRegisterInfo, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
      }
    },
    // 无效数据
    *getBusInvalidData({ payload, callback }, { call, put }) {
      const response = yield call(getBusInvalidDataForPage, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *busDynamicLawDataByPreviewCode({ payload, callback }, { call }) {
      const response = yield call(getBusDynamicLawDataByPreviewCode, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
      }
    },

    // 免处罚数据
    *getBusPenaltyData({ payload, callback }, { call, put }) {
      const response = yield call(getBusPenaltyDataForPage, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 重点关车辆
    *getBusDynamicFocus({ payload, callback }, { call, put }) {
      const response = yield call(getBusDynamicFocusForPage, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *deleteFocus({ payload, callback }, { call }) {
      const response = yield call(deleteBusDynamicFocus, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    // 数据导出
    // 免处罚数据
    // 数据导出
    // 免处罚数据
    *exportBusPenalty({ payload, callback }, { call }) {
      const response = yield call(exportBusPenaltyData, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, '免处罚数据.zip');
        callback && callback(200);
      }
    },
    // 无效数据
    // 无效数据
    *exportBusInvalid({ payload, callback }, { call }) {
      const response = yield call(exportBusInvalidData, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, '无效数据.zip');
        callback && callback(200);
      }
    },
    // 执法检测数据
    // 执法检测数据
    *exportBusDynamicLaw({ payload, callback }, { call }) {
      const response = yield call(exportBusDynamicLawData, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, '执法检测数据.zip');
        callback && callback(200);
      }
    },
    // 案卷数据
    // 案卷数据
    *exportBusDynamicLawCase({ payload, callback }, { call }) {
      const response = yield call(exportBusDynamicLawCaseData, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, '案卷数据.zip');
        callback && callback(200);
      }
    },
    *fileList({ payload, callback }, { call }) {
      const response = yield call(getFileList, payload);
      filterResponse(response);
      callback && callback(response.rows);
    },
    *batchPass({ payload, callback }, { call }) {
      const response = yield call(setBatchPass, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *batchPassReturn({ payload, callback }, { call }) {
      const response = yield call(setBatchPassReturn, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *submitEntry({ payload, callback }, { call }) {
      const response = yield call(setSubmitEntry, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    // 法制审核人确认
    *reviewer({ payload, callback }, { call }) {
      const response = yield call(setReviewer, payload);
      const newData = filterResponse(response);
      callback && callback(newData);
    },
    // 案件管理人员确认
    *principal({ payload, callback }, { call }) {
      const response = yield call(setPrincipal, payload);
      const newData = filterResponse(response);
      callback && callback(newData);
    },
    // 发送短信
    *sendBusSms({ payload, callback }, { call }) {
      const response = yield call(sendMsgSms, payload);
      const newData = filterResponse(response);
      callback && callback(newData);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
  },
};

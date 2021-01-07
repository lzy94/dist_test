import Authorized from '@/utils/Authorized';
import { parse } from 'qs';
import { message } from 'antd';

import { planObjectNumber, planObject } from './dictionaries';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const isUrl = path => {
  return reg.test(path);
};

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export { isAntDesignProOrDev, isAntDesignPro, isUrl };

/**
 * 格式化路由
 * @param list
 * @returns {Array}
 */
export function formatMenuList(list, prefix) {
  return list.map(item => {
    const arr = {
      children: item.children ? formatMenuList(item.children, prefix) : [],
      path: prefix + (/^\/.*$/.test(item.alias) ? item.alias : `/${item.alias}`), // 判断路径开头是否含有 ‘/’ 没有则添加
      exact: true,
      name: item.name,
      icon: item.menuIcon,
      authority: ['admin'],
      id: item.id,
      parentId: item.parentId,
    };
    return Authorized.check(item.authority, arr, null);
  });
}

export function isNumbre(value) {
  const reg = /^-?[0-9]*(\.[0-9]*)?$/;
  return reg.test(value);
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function setLocalStorage(key, value) {
  const proAuthority = typeof value === 'string' ? [value] : value;
  return localStorage.setItem(key, JSON.stringify(proAuthority));
}

export function getLocalStorage(key) {
  if (localStorage.getItem(key) === 'undefined') {
    return 0;
  }
  return JSON.parse(localStorage.getItem(key) || '[]');
}

/**
 * 邮箱后缀
 * @param value
 * @returns {*}
 */
export function emailSuffix(value) {
  return !value || value.indexOf('@') >= 0
    ? []
    : [
        `${value}@gmail.com`,
        `${value}@163.com`,
        `${value}@qq.com`,
        `${value}@sina.com`,
        `${value}@sohu.com`,
        `${value}@sogou.com`,
        `${value}@139.com`,
      ];
}

/**
 * 判断权限是否存在
 * @param str
 * @returns {boolean}
 */
export function checkAuth(str) {
  if (getLocalStorage('auth').indexOf(str) > -1) {
    return true;
  }
  return false;
}

/**
 * @description 一个页面多个模块   不同权限
 * @param arr 当前页面所有权限
 * @returns {*[]}
 */
export function multipleCheckAuth(arr) {
  let path = window.location.hash.replace('#', '');
  if (!path) {
    path = window.location.pathname;
  }
  if (path.indexOf('/traffic') > -1) {
    path = path.replace('/traffic', '');
  }
  const auth = arr
    .map(item => {
      if (item.indexOf(path) > -1) {
        return item;
      }
      return null;
    })
    .filter(item => item);
  return auth;
}

/**
 * @description 判断是否是路政
 * @returns {boolean}
 */
export function isTraffic() {
  const mainMsg = JSON.parse(localStorage.getItem('mainMsg') || '{}');
  const department = mainMsg.department ? mainMsg.department.split(',') : [];
  if (department.indexOf('-1') > -1) {
    return true;
  }
  return false;
}

let levelThreeMenu = [];

function getLevelThree(path, data) {
  for (let i = 0; i < data.length; i++) {
    if (path === data[i].path) {
      levelThreeMenu = data[i].children;
      return levelThreeMenu;
    } else {
      levelThreeMenu = getLevelThree(path, data[i].children);
    }
  }
  return levelThreeMenu;
}

export function returnLevelThree(path) {
  const menu = getLocalStorage('menu');
  return getLevelThree(path, menu);
}

export function formatTreeList(list) {
  return list.map(item => {
    return {
      children: item.children ? formatTreeList(item.children) : [],
      title: item.areaName || item.name,
      key: item.code || item.id,
      value: item.code || item.id,
      label: item.areaName || item.name,
      parentId: item.parentId || 0,
      alias: item.alias || '',
    };
  });
}

/**
 * @description 防抖节流
 * @description 防止多次弹出 TOKEN 失效提示框
 * @returns {function(...[*]=)}
 * @constructor
 */
function MSG_403() {
  let timer = null;
  return () => {
    if (!timer) {
      message.error('登录状态已过期，请重新登录');
      timer = setTimeout(() => {
        window.location.href = '/#/user';
        clearItem();
        clearTimeout(timer);
        timer = null;
      }, 1500);
    }
  };
}

const msg403 = MSG_403();

/**
 * 过滤接口返回数据
 * 判断返回状态码
 * @param response
 * @returns {*}
 */
export function filterResponse(response) {
  let res = '';
  switch (response.code) {
    case 200:
      res = 200;
      break;
    case 401:
      res = 401;
      message.error(response.msg || response.message);
      break;
    case 408:
      res = 408;
      msg403();
      break;
    case '408':
      res = 408;
      msg403();
      break;
    case 500:
      res = 500;
      // message.error('服务器异常！');
      message.error(response.msg || response.message);
      break;
    case 502:
      res = 502;
      message.error(response.msg || response.message);
      break;
    default:
      res = response;
  }
  return res;
}

/**
 * @description 清除本地存储
 * @export
 */
export function clearItem() {
  localStorage.removeItem('token');
  localStorage.removeItem('menu');
  localStorage.removeItem('menuKeys');
  localStorage.removeItem('auth');
  localStorage.removeItem('organId');
  localStorage.removeItem('siteIds');
  localStorage.removeItem('staticSite');
  localStorage.removeItem('mainMsg');
  localStorage.removeItem('menuType');
  localStorage.removeItem('addr');
  localStorage.removeItem('len');
  localStorage.removeItem('carToken');
}

export function clearItem2() {
  localStorage.removeItem('menu');
  localStorage.removeItem('menuKeys');
  localStorage.removeItem('organId');
  localStorage.removeItem('siteIds');
  localStorage.removeItem('staticSite');
  localStorage.removeItem('len');
}

export function siteListFormat(list) {
  let arr1 = [],
    arr2 = [];
  for (let i = 0; i < list.length; i++) {
    let data = {
      title: list[i].siteName,
      value: list[i].siteCode,
      key: list[i].siteCode,
    };
    list[i].siteType === '1' ? arr1.push(data) : arr2.push(data);
  }
  return [arr1, arr2];
}

/**
 *
 * @param {*} file
 */
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * @description pdf,doc,docx ,zip上传限制
 * @param {*} file
 */
export function filePDZ(file) {
  const isJpgOrPng =
    file.type === 'application/x-zip-compressed' ||
    file.type === 'application/pdf' ||
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (!isJpgOrPng) {
    message.error('只能上传 pdf , doc, docx, zip !');
  }
  return isJpgOrPng;
}

/**
 * @description pdf,doc,docx 上传限制
 * @param {*} file
 */
export function fileBeforeUpload(file) {
  const isJpgOrPng =
    file.type === 'application/pdf' ||
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (!isJpgOrPng) {
    message.error('只能上传 pdf , doc, docx !');
  }
  return isJpgOrPng;
}

/**
 * @description 海事附件管理 pdf,exel,ppt,doc,docx 上传限制
 * @param {*} file
 */
export function fileHSUpload(file) {
  const isJpgOrPng =
    file.type === 'application/pdf' ||
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    file.type === 'application/vnd.ms-powerpoint';
  if (!isJpgOrPng) {
    message.error('只能上传 pdf , word, excel, ppt !');
  }
  return isJpgOrPng;
}

/**
 * @description JPG/PNG 上传限制
 * @param {*} file
 */
export function imageBeforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG  !');
  }
  return isJpgOrPng;
}

export function audioBefore(file) {
  const isMp3 = file.type === 'audio/mpeg';
  if (!isMp3) {
    message.error('只能上传 mp3  !');
  }
  return isMp3;
}

export function checkDate(val) {
  const reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  return reg.test(val);
}

export function checkPhone(rule, value, callback) {
  // const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[45678]|19[89]|16[6])[0-9]{8}$/;
  const regPhone = /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/;
  if (!regPhone.test(value)) {
    callback('请输入正确手机号码!');
  } else {
    callback();
  }
}

export function checkPhoneV2(value) {
  const regPhone = /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/;
  if (regPhone.test(value)) {
    return true;
  }
  return false;
}

export function checkLicensePlate(rule, value, callback) {
  const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  if (!reg.test(value)) {
    callback('请输入正确的车牌号!');
  } else {
    callback();
  }
}

export function checkLicensePlateV2(value) {
  const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  if (reg.test(value)) {
    return true;
  }
  return false;
}

export function checkIdCard(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    callback('请输入正确的身份证号!');
  } else {
    callback();
  }
}

/**
 * @description 经度验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function checkLongitude(rule, value, callback) {
  const reg = /^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/;
  if (!reg.test(value)) {
    callback('请输入正确的经度!');
  } else {
    callback();
  }
}

/**
 * @description 纬度验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function checkLatitude(rule, value, callback) {
  const reg = /^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/;
  if (!reg.test(value)) {
    callback('请输入正确的纬度!');
  } else {
    callback();
  }
}

export function downLoadFile(response, fileName) {
  const blobUrl = URL.createObjectURL(response);
  const aElement = document.createElement('a');
  document.body.appendChild(aElement);
  aElement.style.display = 'none';
  aElement.href = blobUrl;
  aElement.download = fileName;
  aElement.click();
  document.body.removeChild(aElement);
}

function formatTableX(data, field) {
  const overLimit = JSON.parse(JSON.stringify(data));
  const x = data.map(item => item[field]);
  const overLimitX = overLimit.map(item => item[field]);
  for (const i in x) {
    if (overLimitX.indexOf(x[i]) < 0) {
      overLimit.push({
        TOTAL: 0,
        [field]: x[i],
      });
    }
  }
  return overLimit.sort((a, b) => a[field] - b[field]);
}

/**
 * 处理超限统计 table 列表
 * @param data
 * @param payload
 * @returns {[*]}
 */
// export function formatTable(data, payload) {
//   const total = data.overLimit;
//   const field = ['HOUR', 'DAY', 'MONTH'];
//   const fieldName = ['时', '日', '月', '年'];
//   if (total.length === 0) return [[], []];
//   const overLimit = formatTableX(total, field[payload.dateType - 1]);
//   const columns = total.map((item, index) => {
//     const dataName = item[field[payload.dateType - 1]] + fieldName[payload.dateType - 1];
//     return {
//       key: index,
//       title: dataName,
//       dataIndex: 'total' + index,
//     };
//   });
//   columns.unshift({
//     key: -1,
//     width: 90,
//     title: '检测类型',
//     dataIndex: 'totalType',
//     field: 'left',
//   });
//   columns.push({
//     key: total.length,
//     title: `${fieldName[payload.dateType]}统计`,
//     dataIndex: 'totalCount',
//   });

//   const tableData = [];
//   const obj = { id: 0 }, obj2 = { id: 1 }, obj3 = { id: 2 };
//   let  overLimitCount = 0;
//   let[totalCount,truckOverTotal,truckTotal] = [0,0,0];
//   for (let i = 0; i < total.length; i++) {
//     totalCount += total[i].TOTAL;
//   }
//   for (let i = 0; i < overLimit.length; i++) {
//     overLimitCount += overLimit[i].TOTAL;
//   }
//   for (let i = 0; i < total.length; i++) {
//     if (i === 0) {
//       obj['totalType'] = '检测数(辆)';
//     }
//     if ((i + 1) === total.length) {
//       obj['totalCount'] = totalCount;
//     }
//     obj['total' + i] = total[i].TOTAL;
//   }
//   tableData.push(obj);

//   for (let i = 0; i < overLimit.length; i++) {
//     if (i === 0) {
//       obj2['totalType'] = payload.type === 'super' ? '超速数(辆)' : '货车超限数(辆)';
//     }
//     if ((i + 1) === overLimit.length) {
//       obj2['totalCount'] = overLimitCount;
//     }
//     obj2['total' + i] = overLimit[i].TOTAL;
//   }
//   tableData.push(obj2);

//   for (let i = 0; i < total.length; i++) {
//     if (i === 0) {
//       obj3['totalType'] = payload.type === 'super' ? '超速率(%)' : '超限率(%)';
//     }
//     obj3['total' + i] = (overLimit[i] ? overLimit[i].TOTAL / total[i].TOTAL * 100 : 0).toFixed(2);
//     if ((i + 1) === overLimit.length) {
//       obj3['totalCount'] = (overLimitCount / totalCount * 100).toFixed(2);
//     }
//   }
//   tableData.push(obj3);
//   console.log(columns, tableData)
//   return [columns, { list: tableData }];
// };

export function formatTable(data, payload) {
  const total = data.overLimit;
  const field = ['HOUR', 'DAY', 'MONTH'];
  const fieldName = ['时', '日', '月', '年'];
  if (total.length === 0) return [[], []];
  const columns = total.map((item, index) => {
    const dataName = item[field[payload.dateType - 1]] + fieldName[payload.dateType - 1];
    return {
      key: index,
      title: dataName,
      dataIndex: 'total' + index,
    };
  });
  columns.unshift({
    key: -1,
    width: 120,
    title: '检测类型',
    dataIndex: 'totalType',
    fixed: 'left',
  });
  columns.push({
    key: total.length,
    title: `${fieldName[payload.dateType]}统计`,
    dataIndex: 'totalCount',
  });

  const tableData = [];
  const [obj, obj2, obj3, obj4] = [
    { id: 0, width: 100 },
    { id: 1, width: 100 },
    { id: 2, width: 100 },
    {
      id: 3,
      width: 100,
    },
  ];
  let [totalCount, truckOverTotal, truckTotal] = [0, 0, 0];
  for (let i = 0; i < total.length; i += 1) {
    totalCount += total[i].TOTAL;
    truckOverTotal += total[i].TRUCKOVERTOTAL;
    truckTotal += total[i].TRUCKTOTAL;
  }

  for (let i = 0; i < total.length; i++) {
    if (i === 0) {
      obj['totalType'] = '检测数(辆)';
      obj2['totalType'] = '货车总数(辆)';
      obj3['totalType'] = '货车超限数(辆)';
    }
    if (i + 1 === total.length) {
      obj['totalCount'] = totalCount;
      obj2['totalCount'] = truckTotal;
      obj3['totalCount'] = truckOverTotal;
    }
    obj['total' + i] = total[i].TOTAL;
    obj2['total' + i] = total[i].TRUCKTOTAL;
    obj3['total' + i] = total[i].TRUCKOVERTOTAL;
  }

  for (let i = 0; i < total.length; i++) {
    if (i === 0) {
      obj4['totalType'] = '货车超限率(%)';
    }
    obj4['total' + i] = ((total[i].TRUCKOVERTOTAL / (total[i].TRUCKTOTAL || 1)) * 100).toFixed(2);
    if (i + 1 === total.length) {
      obj4['totalCount'] = ((truckOverTotal / truckTotal) * 100).toFixed(2);
    }
  }
  tableData.push(obj);
  tableData.push(obj2);
  tableData.push(obj3);
  tableData.push(obj4);
  return [columns, { list: tableData }];
}

/**
 * 数组去重
 * @param arr
 * @returns {*}
 */
export function unique(array) {
  return array.filter((item, index, arr) => {
    return arr.indexOf(item, 0) === index;
  });
}

export function getRandomColor() {
  const rand = Math.floor(Math.random() * 0xffffff).toString(16);
  if (rand.length === 6) {
    return rand;
  }
  return getRandomColor();
}

/**
 * @description
 * @returns {*[][]}
 */
export function getPlan() {
  const mainMsg = JSON.parse(localStorage.getItem('mainMsg') || '{}');
  const { department } = mainMsg;
  if (!department) return [[], []];
  const depa = department.split(',');
  const depaName = depa.map(item => {
    const index = planObjectNumber.indexOf(parseInt(item, 10));
    return planObject[index];
  });
  return [depa, depaName];
}

/**
 * @description 浮点加法
 * @param {*} arg1
 * @param {*} arg2
 */
export function accAdd(arg1, arg2) {
  let r1, r2, m, c;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    const cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm;
      arg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
  }
  return (arg1 + arg2) / m;
}

/**
 * @description 浮点减法
 * @param {*} arg1
 * @param {*} arg2
 */
export function accSubtract(arg1, arg2) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

function transformlat(lng1, lat1) {
  const lat = +lat1;
  const lng = +lng1;
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformlng(lng1, lat1) {
  const lat = +lat1;
  const lng = +lng1;
  let ret =
    300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

function out_of_china(lng, lat) {
  const newLat = +lat;
  const newLng = +lng;
  return !(newLng > 73.66 && newLng < 135.05 && newLat > 3.86 && newLat < 53.55);
}

export function wgs84togcj02(lng, lat) {
  const newLat = +lat;
  const newLng = +lng;
  if (out_of_china(newLng, newLat)) {
    return [newLng, newLat];
  }
  const dlat = transformlat(newLng - 105.0, newLat - 35.0);
  const dlng = transformlng(newLng - 105.0, newLat - 35.0);
  const radlat = (newLat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  const dlat1 = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
  const dlng1 = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
  const mglat = newLat + dlat1;
  const mglng = newLng + dlng1;
  return [mglng, mglat];
}

export const liveUrl = 'http://192.168.1.237:10800';
export const videoUrl = 'http://192.168.1.237:7002/';
export const imgUrl = 'http://192.168.1.237:7002/';
export const fileUrl = 'http://192.168.1.237:7002/';
export const pdfUrl = 'http://192.168.1.237:7002/';
export const socketUrl = 'http://192.168.1.237:8888/websocket';
// 公路
export const conserveSocketUrl = 'http://220.166.58.28:8888/websocket';

// export const liveUrl = 'http://60.255.137.83:10000';
// export const videoUrl = 'http://60.255.137.83:28000/';
// export const imgUrl = 'http://60.255.137.83:28000/';
// export const fileUrl = 'http://60.255.137.83:28000/';
// export const pdfUrl = 'http://60.255.137.83:28000/';
// export const socketUrl = 'http://60.255.137.83:28888/websocket';
// // 公路
// export const conserveSocketUrl = 'http://60.255.137.83:28888/websocket';

// export const liveUrl = 'http://51.37.126.253:10800';
// export const videoUrl = 'http://51.37.126.253/';
// export const imgUrl = 'http://51.37.126.253/';
// export const imgUrlSpeed = 'http://51.37.126.253:83/';
// export const fileUrl = 'http://51.37.126.253/';
// export const pdfUrl = 'http://51.37.126.253/';
// export const socketUrl = 'http://51.37.126.251:8890/websocket';

// export const conserveSocketUrl = 'http://51.37.126.251:8890/websocket';

// export const liveUrl = 'http://192.168.0.6:10800';
// export const videoUrl = 'http://192.168.0.6:9002/';
// export const imgUrl = 'http://192.168.0.6:9002/';
// // export const imgUrlSpeed = 'http://192.168.0.6:9002/';
// export const fileUrl = 'http://192.168.0.6:9002/';
// export const pdfUrl = 'http://192.168.0.6:9002/';
// export const socketUrl = 'http://192.168.0.2:8888/websocket';

// export const conserveSocketUrl = 'http://192.168.0.2:8888/websocket';

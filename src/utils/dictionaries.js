// 常用字典
// chart color
export const colors = [
  '#5ab1ef',
  '#ffb980',
  '#d87a80',
  '#8d98b3',
  '#e5cf0d',
  '#97b552',
  '#95706d',
  '#dc69aa',
  '#07a2a4',
  '#9a7fd1',
  '#588dd5',
  '#f5994e',
  '#c05050',
  '#59678c',
  '#c9ab00',
  '#7eb00a',
  '#6f5553',
  '#c14089',
];

// 公路类型
export const roadType = ['国道', '省道', '县道', '乡道', '村道', '桥梁', '专有公路'];

// 系统类型
export const planObject = ['路政', '养护', '海事', '运管', '建设'];
export const planObjectNumber = [-1, -2, -3, -4, -5];

// 等级
export const planRank = ['一级', '二级', '三级', '四级'];

/**
 * @description 根据用户模块获取类型
 * @returns {*[][]}
 */
export function getPlanObject() {
  const dept = JSON.parse(localStorage.getItem('mainMsg') || '[]').department || '';
  const depts = dept.split(',').map(item => parseInt(item, 10));
  const names = depts.map(item => {
    const index = planObjectNumber.indexOf(parseInt(item, 10));
    return planObject[index];
  });
  return [depts, names];
}

// 海事=》行政管理 = 字典数据

// 泵船安全检查 船舶规范详情
export const pumpShipRules = [
  '在船员人员同证书一致性',
  '停泊水域是否经批准',
  '停泊水域是否经批准',
  '停泊水域是否经批准',
  '是否有防洪应急桩',
  '是否开展了应急演习',
];

// 船旗国监检查  船舶证书
export const shipCertificate = [
  '船舶国籍证书是否有效',
  '船舶吨位证书是否有效',
  '适航证书是否有效',
  '危化品适装证书是否有效',
  '安全检查记录薄是否规范',
  '轮机日志填写是否符合要求',
  '船舶所有权书是否有效',
  '船舶载重线证书是否有效',
  '防止油污证书是否有效',
  '最低安全配员证书',
  '航行日志填写是否符合要求',
];

// 船员证书
export const crewCertificate = ['船员适任证书是否有效', '特殊培训合格证书是否有效'];

// 救生设备
export const lifeasvingEquipment = [
  '救生圈数量与证书是否符合',
  '存放位置是否规范',
  '救生圈是否有船检标志',
  '救生衣是否有船检标志',
  '救生衣数量是否与证书相符',
  '存放位置是否规范',
  '堵漏器材及工具存放位置是否规范',
];

// 消防设备
export const fireEquipment = [
  '灭火器的数量与证书是否相符',
  '泵体是否存有裂纹',
  '灭火器是否经船检机构认可',
  '是否标明制造厂、使用说明、制造年月、试验压力',
  '消防泵的布置是否符合要求',
  '轴封处有无泄漏',
  '进出泵的管路有无严重绣蚀或泄漏',
  '布置是否符合要求',
  '消防栓、水带、水枪是否符合',
  '消防水管有绣蚀、洞穿',
];

// 信号设备
export const signalingEquipment = [
  '声响信号配置是否规范要求',
  '是否符合要求',
  '信号灯是否能正常发光',
  '号灯备品是否充足',
  '号型、号旗配备是否齐全',
  '是否保持完好',
];

// 舵系统
export const rudderSystem = [
  '舵效是合达到规定要求',
  '操舵人员是否熟练',
  '通往舵机房的通信设备是否可用',
];

// 锚设备
export const anchorEquipment = [
  '外部检视是否正常',
  '锚机座与甲板连接处的座板是否蚀耗',
  '锚链、转环、卸扣蚀耗后直径是否小于原设计值的85%',
];

// 系泊
export const mooring = [
  '绞缆机座、系缆桩、导缆孔与船体连接处无绣蚀',
  '系缆装置是否可靠',
  '与船体连接处的焊接、螺栓是否牢固',
];

// 机舱
export const cabin = [
  '机舱前后舱壁是否水密',
  '是否按要求配备灭火器',
  '机舱排气管是否用隔热材料包扎',
  '前后皮带轮处有无护罩',
];

// 船舶现场检查 总体检查
export const overallInspection = ['船舶开航前检查清单'];

// 证书检查：船舶证书
export const checkingShipCertificate = ['船舶国籍证书', '船舶最低安全配员证书', '安全管理证书'];

// 证书检查：船舶检验证书
export const shipInspectionCertificate = ['适航证书', '吨位证书', '载重线证书'];

// 证书检查：船舶文书
export const shipInstruments = ['船旗国监督检查报告', '航行日志', '轮机日志'];

// 证书检查：船员文书
export const crewPaperwork = ['适任证书', '特殊培训合格证', '船员服务薄'];

// 证书检查：防污文书
export const antifoulingInstruments = ['油类记录薄', '垃圾记录薄', '货物垃圾薄', '油污应急计划'];

// 船员配置：船员配置
export const crewConfiguration = ['人证一致性', '人员满足最低配员', '符合值班的相关规'];

// 船舶进出港报告
export const shipEntryReport = [
  '是否按规定报告',
  '是否将进港报告填写航行日志',
  '在船人员、客货信息一致性',
];

// 重点跟踪船舶
export const focusShips = ['是否为重点跟踪船舶'];

// 载客、载货情况
export const cargoCustomerSituation = ['危险品是否申报', '是否超载', '是否系固'];

// 航行
export const sailing = ['是否为有超越航区航行'];

// 停泊
export const checkingMooring = ['停泊是否有碍航'];

/**
 * @description
 * @param {*} str
 * @param {*} list
 */
export function formatMaritimeDanger(str, list) {
  const data = str ? str.split(',') : [];
  return list.map((item, i) => {
    const index = data.indexOf((i + 1).toString());
    return {
      isError: index < 0,
      name: item,
    };
  });
}

// 运政  业务管理  周期性督查
export const typeNames = ['周期性督查', '实时督查', '安全督查'];
export const frequency = ['年', '季', '月', '周'];

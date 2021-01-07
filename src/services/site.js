import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function querySite(params) {
  return request(`/service/api/system/sysSite/getSysSitePage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function removeSite(params) {
  return request('/service/api/system/sysSite/deleteSysSiteByIds', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addSite(params) {
  return request('/service/api/system/sysSite/addSysSite', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function updateSite(params) {
  return request('/service/api/system/sysSite/updateSysSite', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function detailSite(params) {
  return request('/service/api/system/sysSite/getSysSiteByCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 卸货场地
export async function getUnloadYardsBySiteId(params) {
  return request('/service/api/system/unloadYard/getUnloadYardsBySiteId', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

export async function addUnloadYards(params) {
  return request('/service/api/system/unloadYard/addUnloadYard', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function updateUnloadYards(params) {
  return request('/service/api/system/unloadYard/updateUnloadYard', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {...params},
  });
}

export async function deleteUnloadYardsById(params) {
  return request('/service/api/system/unloadYard/deleteUnloadYardById', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 货物
export async function getUnloadGoodsForPage(params) {
  return request('/service/api/system/unloadGoods/getUnloadGoodsForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function addUnloadGoods(params) {
  return request('/service/api/system/unloadGoods/addUnloadGoods', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function updateUnloadGoods(params) {
  return request('/service/api/system/unloadGoods/updateUnloadGoods', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {...params},
  });
}

export async function deleteUnloadGoodsByIds(params) {
  return request('/service/api/system/unloadGoods/deleteUnloadGoodsByIds', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 站点建设详细
export async function getSysSiteBuildForPage(params) {
  return request('/service/api/system/sysSiteBuild/getSysSiteBuildForPage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function addSysSiteBuild(params) {
  return request('/service/api/system/sysSiteBuild/addSysSiteBuild', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function updateSysSiteBuild(params) {
  return request('/service/api/system/sysSiteBuild/updateSysSiteBuild', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params,
    },
  });
}

export async function deleteSysSiteBuildByIds(params) {
  return request('/service/api/system/sysSiteBuild/deleteSysSiteBuildByIds', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  });
}

// 流媒体通道
export async function getMediaConfsBySiteCode(params) {
  return request('/service/api/system/sysSite/getMediaConfsBySiteCode', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params,
  })
}

export async function addMediaConf(params) {
  return request('/service/api/system/sysSite/addMediaConf', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    data: {
      ...params
    }
  })
}

export async function deleteMediaConfById(params) {
  return request('/service/api/system/sysSite/deleteMediaConfById', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params
  })
}

export async function getSiteByUserSite(params) {
  return request('/service/api/system/sysSite/getSiteByUserSite', {
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    params
  })
}


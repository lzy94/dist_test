import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryDevice(params) {
    return request(`/service/api/system/siteEquipment/getEquipmentPage`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {
            ...params
        }
    });
}

export async function removeDevice(params) {
    return request('/service/api/system/siteEquipment/deleteEquipmentByIds', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function addDevice(params) {
    return request('/service/api/system/siteEquipment/addEquipment', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {
            ...params,
        },
    });
}

export async function updateDevice(params) {
    return request('/service/api/system/siteEquipment/updateEquipment', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {
            ...params,
        },
    });
}


export async function getDeviceById(params) {
    return request('/service/api/system/siteEquipment/getEquipment', {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    })
}


// 维修记录
export async function getEquipmentLogPage(params) {
    return request('/service/api/system/equipmentLog/getEquipmentLogPage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    })
}

export async function addEquipmentLog(params) {
    return request('/service/api/system/equipmentLog/addEquipmentLog', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    })
}

export async function updateEquipmentLog(params) {
    return request('/service/api/system/equipmentLog/updateEquipmentLog', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    })
}

export async function deleteEquipmentLogByIds(params) {
    return request('/service/api/system/equipmentLog/deleteEquipmentLogByIds', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    })
}


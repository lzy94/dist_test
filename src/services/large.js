import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryLarge(params) {
    return request('/service/api/system/DicTransportLicence/getDicTransportLicencePage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    });
}

export async function removeLarge(params) {
    return request('/service/api/system/DicTransportLicence/deleteDicTransportLicence', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function addLarge(params) {
    return request('/service/api/system/DicTransportLicence/addDicTransportLicence', {
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

export async function updateLarge(params) {
    return request('/service/api/system/DicTransportLicence/updateDicTransportLicence', {
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


export async function getLargeDetail(params) {
    return request('/service/api/system/DicTransportLicence/getDicTransportLicence', {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

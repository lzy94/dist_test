import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function querySource(params) {
    return request('/service/api/system/dicSourceCompany/dicSourceCompanyForPage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    });
}

export async function removeSource(params) {
    return request('/service//api/system/dicSourceCompany/dicSourceCompanyDelById', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    });
}

export async function addSource(params) {
    return request('/service/api/system/dicSourceCompany/dicSourceCompanyAdd', {
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

export async function updateSource(params) {
    return request('/service/api/system/dicSourceCompany/dicSourceCompanyUpdate', {
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

export async function getDicSourceCompanyById(params) {
    return request(`/service/api/system/dicSourceCompany/getDicSourceCompanyById/${params}`, {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    })
}

export async function getSourceCompanyByOrganId(params) {
    return request('/service/api/system/dicSourceCompany/getSourceCompanyByOrganId', {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    })
}

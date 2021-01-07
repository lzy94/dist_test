import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryCompany(params) {
    return request('/service/api/system/dicTransportCompany/dicTransportCompanyForPage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    });
}

export async function removeCompany(params) {
    return request('/service/api/system/dicTransportCompany/dicTransportCompanyDelById', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function addCompany(params) {
    return request('/service/api/system/dicTransportCompany/dicTransportCompanyAdd', {
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

export async function updateCompany(params) {
    return request('/service/api/system/dicTransportCompany/dicTransportCompanyUpdate', {
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

export async function getCompanyDetail(params) {
    return request(`/service/api/system/dicTransportCompany/getDicTransportCompanyById/${params}`, {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

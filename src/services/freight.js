import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryFreight(params) {
    return request('/service/api/system/dicTransportMan/dicTransportManForPage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    });
}

export async function removeFreight(params) {
    return request('/service/api/system/dicTransportMan/dicTransportManById', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function addFreight(params) {
    return request('/service/api/system/dicTransportMan/dicTransportManAdd\n', {
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

export async function updateFreight(params) {
    return request('/service/api/system/dicTransportMan/dicTransportManUpdate', {
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

export async function getFreightDetail(params) {
    return request(`/service/api/system/dicTransportMan/getDicTransportManById/${params}`, {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

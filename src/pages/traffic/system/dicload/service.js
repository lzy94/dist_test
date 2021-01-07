import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryDicload(params) {
    return request('/service/api/system/dicLoadStandard/dicLoadStandardList', {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    });
}

export async function removeDicload(params) {
    return request('/service/api/system/dicLoadStandard/dicLoadStandardDeleteById', {
        method:'DELETE',
        params,
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

export async function addDicload(params) {
    return request('/service/api/system/dicLoadStandard/dicLoadStandardAdd', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {
            ...params
        },
    });
}

export async function updateDicload(params) {
    return request('/service/api/system/dicLoadStandard/dicLoadStandardUpdate', {
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

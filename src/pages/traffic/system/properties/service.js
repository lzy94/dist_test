import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryProperties(params) {
    return request('/service/api/system/sysProperties/listJson', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    });
}

export async function updateProperties(params) {
    return request('/service/api/system/sysProperties/save', {
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

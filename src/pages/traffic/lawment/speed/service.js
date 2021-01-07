import request from '@/utils/request';
import { getLocalStorage } from '@/utils/utils';

export async function getAllForPage(params) {
    return request('/service/api/busViolationData/v1/getAllForPage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: { ...params }
    });
}

export async function getOne(params) {
    return request(`/service/api/busViolationData/v1/getOne`, {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    });
}

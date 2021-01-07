import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryLogs(params) {
    return request('/service/api/system/sysLogs/list', {
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

export async function removeLogs(params) {
    return request('/service/api/system/sysLogs/removes', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function getLogsDetail(params) {
    return request(`/service/api/system/sysLogs/get/${params}`, {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    })
}

import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryLogSetting(params) {
    return request('/service/api/system/sysLogsSettings/list', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params},
    });
}

export async function removeLogSetting(params) {
    return request('/service/api/system/sysLogsSettings/removes', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function saveLogSetting(params) {
    return request('/service/api/system/sysLogsSettings/save', {
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

export async function getDetail(params) {
    return request(`/service/api/system/sysLogsSettings/get/${params}`, {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function querySms(params) {
    return request('/service/api/system/sysMessageLog/getMessageLogPage', {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {
            ...params
        }
    });
}

export async function removeSms(params) {
    return request('/service/api/system/sysMessageLog/deleteMessageLog', {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    });
}

import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function query() {
    return request('/api/users');
}

export async function queryCurrent() {
    return request('/result/api/uc/user/getCurrentUser', {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

/**
 * 获取当前用户的请求权限
 * @returns {Promise<void>}
 */
export async function getCurrentUserMethodAuth() {
    return request('/result/api/uc/sysMenu/getCurrentUserMethodAuth', {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

export async function changUserPsd(params) {
    console.log(params)
    // return request('/result/api/uc/user/changUserPsd', {
    //     headers: {
    //         'Authorization': `Bearer ${getLocalStorage('token')[0]}`
    //     },
    //     data: {
    //         ...params
    //     }
    // })
}


export async function queryNotices() {
    return request('/api/notices');
}

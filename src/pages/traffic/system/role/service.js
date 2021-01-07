import request from '@/utils/request';
import {getLocalStorage} from "../../../../utils/utils";


export async function queryRole(params) {
    return request(`/result/api/uc/role/getRolePage`, {
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

export async function removeRole(params) {
    return request('/result/api/uc/role/deleteRoleByIds', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function addRole(params) {
    return request('/result/api/uc/role/addRole', {
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

export async function updateRole(params) {
    return request('/result/api/uc/role/updateRole', {
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

export async function getRoleDetail(params) {
    return request('/result/api/uc/role/getRole', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });

}


export async function activateUser(params) {
    return request('/result/api/uc/role/activateRoles', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: params,
    });
}

export async function forbiddenUser(params) {
    return request('/result/api/uc/role/forbiddenRoles', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: params,
    });
}


export async function getByRoleAlias(params) {
    return request('/result/api/uc/sysRoleAuth/getByRoleAlias', {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    })
}

export async function saveSystemRoleAlias(params) {
    return request('/result/api/uc/sysRoleAuth/save', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {
            ...params
        }
    })
}

export async function removeByRoleAlias(params) {
    return request('/result/api/uc/sysRoleAuth/removeByRoleAlias', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    })
}


export async function getRoleUsers(params) {
    return request('/result/api/uc/role/getRoleUsers?code='+params.code, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {
            ...params.filter
        }
    })
}

export async function saveUserRole(params) {
    return request('/result/api/uc/role/saveUserRole', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
        data: {
            ...params
        }
    })
}

export async function deleteUserRole(params) {
    return request('/result/api/uc/role/deleteUserRole',{
        method:'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params
    })
}

import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function queryVehicle(params) {
    return request('/service/api/system/dicTransportCars/dicTransportCarsForPage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    });
}

export async function removeVehicle(params) {
    return request('/service/api/system/dicTransportCars/delTransportCarById', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        params,
    });
}

export async function addVehicle(params) {
    return request('/service/api/system/dicTransportCars/dicTransportCarsAdd', {
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

export async function updateVehicle(params) {
    return request('/service/api/system/dicTransportCars/dicTransportCarsUpdate', {
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

export async function getVehicleDetail(params) {
    return request(`/service/api/system/dicTransportCars/getDicTransportCarsById/${params}`, {
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

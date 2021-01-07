import request from '@/utils/request';
import {getLocalStorage} from '@/utils/utils';

export async function getMenuData(params) {
  // const menuType = localStorage.getItem('department');
    return request(`/result/api/uc/sysMenu/getCurrentUserMenu?menuType=${params}`, {
        headers:{
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
    });
}

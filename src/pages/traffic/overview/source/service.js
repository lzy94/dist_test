import request from '@/utils/request';
import {getLocalStorage} from "@/utils/utils";


export async function queryOverviewSource(params) {
    return request('/service-v2/api/bus/busSourceCompanyData/busSourceCompanyDataForPage', {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
            'x-requested-with': 'XMLHttpRequest'
        },
        data: {...params}
    });
}
//
// export async function getOverviewSourceDetail() {
//     return request('')
//
// }

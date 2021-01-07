import {queryOverviewSource} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'OverviewSource',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryOverviewSource, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data,
            });
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: {
                    list: action.payload.rows,
                    pagination: {
                        total: action.payload.total,
                        pageSize: action.payload.pageSize,
                        current: action.payload.page
                    }
                },
            };
        },
    },
};

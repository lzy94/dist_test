import {queryProperties, updateProperties} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Properties',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryProperties, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * update({payload, callback}, {call, put}) {
            const response = yield call(updateProperties, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
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

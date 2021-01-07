import {querySms, removeSms} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Sms',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(querySms, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data,
            });
        },
        * remove({payload, callback}, {call, put}) {
            const newData = filterResponse(yield call(removeSms, payload.remove));
            if (newData === 200) {
                const response = yield call(querySms, payload.query);
                yield put({
                    type: 'save',
                    payload: response.data || {},
                });
                if (callback) callback();
            }
        }
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

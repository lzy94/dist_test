import {queryLogs, removeLogs, getLogsDetail} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Logs',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryLogs, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * detail({payload, callback}, {call, put}) {
            const response = yield call(getLogsDetail, payload);
            const newData = filterResponse(response);
            // if (newData === 200) {
            if (callback) callback(response || {});
            // }
        },
        * remove({payload, callback}, {call, put}) {
            const response = yield call(removeLogs, payload);
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

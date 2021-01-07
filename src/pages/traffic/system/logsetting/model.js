import {queryLogSetting, removeLogSetting, saveLogSetting, getDetail} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Logsetting',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryLogSetting, payload);
            // filterResponse(response);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * saveData({payload, callback}, {call, put}) {
            const response = yield call(saveLogSetting, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * remove({payload, callback}, {call, put}) {
            const response = yield call(removeLogSetting, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * detail({payload, callback}, {call, put}) {
            const response = yield call(getDetail, payload);
            if (callback) callback(response);
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

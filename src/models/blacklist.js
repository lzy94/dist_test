import {queryBlacklist, removeBlacklist, addBlacklist, updateBlacklist, getBlacklistDetail} from '@/services/blacklist';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Blacklist',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryBlacklist, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data || {},
            });
        },
        * add({payload, callback}, {call, put}) {
            const response = yield call(addBlacklist, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * remove({payload, callback}, {call, put}) {
            const response = yield call(removeBlacklist, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * update({payload, callback}, {call, put}) {
            const response = yield call(updateBlacklist, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * detail({payload, callback}, {call, put}) {
            const response = yield call(getBlacklistDetail, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback(response.data || {});
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

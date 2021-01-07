import {queryLarge, removeLarge, addLarge, updateLarge, getLargeDetail} from '@/services/large';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Large',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryLarge, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * add({payload, callback}, {call, put}) {
            const response = yield call(addLarge, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * remove({payload, callback}, {call, put}) {
            const response = yield call(removeLarge, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * update({payload, callback}, {call, put}) {
            const response = yield call(updateLarge, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * detail({payload, callback}, {call, put}) {
            const response = yield call(getLargeDetail, payload);
            if (callback) callback(response);
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

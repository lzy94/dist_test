import {queryDicload, removeDicload, addDicload, updateDicload} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Dicload',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryDicload, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data,
            });
        },
        * add({payload, callback}, {call, put}) {
            const response = yield call(addDicload, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * remove({payload, callback}, {call, put}) {
            const response = yield call(removeDicload, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * update({payload, callback}, {call, put}) {
            const response = yield call(updateDicload, payload);
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
                    list: action.payload,
                    // pagination: {
                    //     total: action.payload.total,
                    //     pageSize: action.payload.pageSize,
                    //     current: action.payload.page
                    // }
                },
            };
        },
    },
};

import {queryFreight, removeFreight, addFreight, updateFreight, getFreightDetail} from '@/services/freight';
import {filterResponse} from '@/utils/utils';


export default {
    namespace: 'Freight',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryFreight, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data || {},
            });
        },
        * add({payload, callback}, {call, put}) {
            const response = yield call(addFreight, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * remove({payload, callback}, {call, put}) {
            const response = yield call(removeFreight, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * update({payload, callback}, {call, put}) {
            const response = yield call(updateFreight, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * detail({payload, callback}, {call, put}) {
            const response = yield call(getFreightDetail, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback(response.data || {});
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

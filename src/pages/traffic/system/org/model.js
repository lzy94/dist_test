import {queryOrg, removeOrg, addOrg, updateOrg, getOrganById} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Org',

    state: {
        data: {
            list: [],
            pagination: {},
        },
        detail: {}
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryOrg, payload);
            const newData = filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data || {},
            });
        },
        * add({payload, callback}, {call, put}) {
            const newData = filterResponse(yield call(addOrg, payload.add));
            if (newData === 200) {
                const response = yield call(queryOrg, payload.query);
                yield put({
                    type: 'save',
                    payload:  response.data || {},
                });
                if (callback) callback();
            }
        },
        * remove({payload, callback}, {call, put}) {
            const newData = filterResponse(yield call(removeOrg, payload.remove));
            if (newData === 200) {
                const response = yield call(queryOrg, payload.query);
                yield put({
                    type: 'save',
                    payload:  response.data || {},
                });
                if (callback) callback();
            }
        },
        * update({payload, callback}, {call, put}) {
            const newData = filterResponse(yield call(updateOrg, payload.update));
            if (newData === 200) {
                const response = yield call(queryOrg, payload.query);
                yield put({
                    type: 'save',
                    payload:  response.data || {},
                });
                if (callback) callback();
            }
        },
        * detail({payload, callback}, {call, put}) {
            const response = yield call(getOrganById, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                yield put({
                    type: 'detailData',
                    payload: response.data,
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
        detailData(state, action) {
            return {
                ...state,
                detail: action.payload
            }
        }
    },
};

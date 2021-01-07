import { getAllForPage, getOne } from './service';
import { filterResponse } from '@/utils/utils';

export default {
    namespace: 'Speed',

    state: {
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        * fetch({ payload }, { call, put }) {
            const response = yield call(getAllForPage, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data || {},
            });
        },
        * detail({ payload, callback }, { call, put }) {
            const response = yield call(getOne, payload);
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

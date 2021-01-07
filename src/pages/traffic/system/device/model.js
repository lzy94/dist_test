import {
    queryDevice,
    removeDevice,
    addDevice,
    updateDevice,
    getDeviceById,
    getEquipmentLogPage,
    addEquipmentLog,
    updateEquipmentLog,
    deleteEquipmentLogByIds
} from './service';
import {filterResponse} from '@/utils/utils';

export default {
    namespace: 'Device',

    state: {
        data: {
            list: [],
            pagination: {},
        },
        detail: {},
        logData: {
            list: [],
            pagination: {},
        }
    },

    effects: {
        * fetch({payload}, {call, put}) {
            const response = yield call(queryDevice, payload);
            filterResponse(response);
            yield put({
                type: 'save',
                payload: response.data,
            });
        },
        * add({payload, callback}, {call, put}) {
            const newData = filterResponse(yield call(addDevice, payload));
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * remove({payload, callback}, {call, put}) {
            const newData = filterResponse(yield call(removeDevice, payload))
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * update({payload, callback}, {call, put}) {
            const newData = filterResponse(yield call(updateDevice, payload));
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * detail({payload, callback}, {call, put}) {
            const response = yield call(getDeviceById, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback(response.data || {});
            }
        },
        // 维修记录
        * fetchLog({payload, callback}, {call, put}) {
            const response = yield call(getEquipmentLogPage, payload);
            filterResponse(response);
            yield put({
                type: 'saveLog',
                payload: response.data,
            });
            if (callback) callback();
        },
        * addLog({payload, callback}, {call, put}) {
            const response = yield call(addEquipmentLog, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * removeLog({payload, callback}, {call, put}) {
            const response = yield call(deleteEquipmentLogByIds, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
                if (callback) callback();
            }
        },
        * updateLog({payload, callback}, {call, put}) {
            const response = yield call(updateEquipmentLog, payload);
            const newData = filterResponse(response);
            if (newData === 200) {
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
        saveLog(state, action) {
            return {
                ...state,
                logData: {
                    list: action.payload.rows,
                    pagination: {
                        total: action.payload.total,
                        pageSize: action.payload.pageSize,
                        current: action.payload.page
                    }
                }
            }
        },
        detailData(state, action) {
            return {
                ...state,
                detail: action.payload
            }
        }
    },
};

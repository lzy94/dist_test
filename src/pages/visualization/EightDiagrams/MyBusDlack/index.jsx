import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import cloneDeep from 'lodash.clonedeep';
import BusDlack from '../../components/BusDlack/index';
import { getLocalStorage } from '@/utils/utils';
import { areaAllName, areaAllCode } from '../../area.js';


/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading }) => ({
    BigScreen,
    loading: loading.models.BigScreen,
    currentUser: user.currentUser,
}))
export default class MyBusDlack extends PureComponent {

    constructor(props) {
        super(props);
        this.organCode = getLocalStorage('organId') || 51;
    }
    state = {
        busDlackOption: {}
    }


    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'BigScreen/busDlack',
            payload: { organCode: this.organCode },
            callback: () => {
                // callback && callback();
                this.formatBusDlackData();
            }
        })
    }

    formatBusDlackData = () => {
        const { BigScreen: { busDlackData } } = this.props;
        const option = cloneDeep(this.state.busDlackOption);

        option.legend = ['总数'];

        option.xAxisData = busDlackData.map(item => {
            return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
        });

        const series = [{
            name: '总数',
            type: 'line',
            smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#eb64fb'
                    },
                    {
                        offset: 1,
                        color: '#3fbbff0d'
                    }
                    ], false),
                }
            },
            data: busDlackData.map(item => item.TOTAL)
        }];
        option.series = series;

        this.setState({ busDlackOption: option })

    }


    render() {
        const { busDlackOption } = this.state;

        return JSON.stringify(busDlackOption) !== '{}' ?
            <BusDlack
                data={busDlackOption}
            />
            : null;
    }
}
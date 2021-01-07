import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import cloneDeep from 'lodash.clonedeep';
import PersonnelLaw from '../../components/PersonnelLaw/index';
import { getLocalStorage } from '@/utils/utils';
import { areaAllName, areaAllCode } from '../../area.js';


/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading }) => ({
    BigScreen,
    loading: loading.models.BigScreen,
    currentUser: user.currentUser,
}))
export default class MyPersonnelLaw extends PureComponent {

    constructor(props) {
        super(props);
        this.organCode = getLocalStorage('organId') || 51;
    }
    state = {
        personnelLawOption: {}
    }


    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'BigScreen/personnelLaw',
            payload: { organCode: this.organCode },
            callback: () => {
                // callback && callback();
                this.formatPersonnelLawData();
            }
        })
    }

    formatPersonnelLawData = () => {
        const { BigScreen: { personnelLawData } } = this.props;
        const option = cloneDeep(this.state.personnelLawOption);

        const legendData = ['总数', '初审', '复审', '签批', '结案', '免处罚', '无效数据'];
        const legendField = ['TOTAL', 'PENDINGVERIFY', 'VERIFYPASS', 'SIGNINGPASS', 'ARCHIVEDATE', 'PENALTYDATE', 'INCALIDDATE'];
        const keys = personnelLawData.map(item => Object.keys(item).join())

        const newData = keys.map((item, index) => personnelLawData[index][item][0]);

        option.xAxisData = keys;
        option.legend = legendData;

        const series = legendData.map((item, index) => ({
            name: legendData[index],
            smooth: true,
            type: index === 0 ? 'line' : 'bar',
            barMaxWidth: 10,
            data: newData.map((item2) => item2[legendField[index]])
        }))

        series[0].areaStyle = {
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
        };

        option.series = series;
        this.setState({ personnelLawOption: option });
    }


    render() {
        const { personnelLawOption } = this.state;

        return JSON.stringify(personnelLawOption) !== '{}' ?
            <PersonnelLaw
                data={personnelLawOption}
            />
            : null;
    }
}
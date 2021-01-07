import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import cloneDeep from 'lodash.clonedeep';
import DyLawCase from '../../components/DyLawCase/index';
import { getLocalStorage } from '@/utils/utils';
import { areaAllName, areaAllCode } from '../../area.js';


/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading }) => ({
    BigScreen,
    loading: loading.models.BigScreen,
    currentUser: user.currentUser,
}))
export default class MyStaticLawData extends PureComponent {

    constructor(props) {
        super(props);
        this.organCode = getLocalStorage('organId') || 51;
    }
    state = {
        dyLawCaseOption: {}
    }


    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'BigScreen/bigScreenDyLawCaseData',
            payload: { organCode: this.organCode },
            callback: () => {
                // callback && callback();
                this.formatDyLawCase();
            }
        })
    }

    /**
  * @description 格式化案件状态
  */
    formatDyLawCase = () => {
        const { BigScreen: { dyLawCase } } = this.props;
        const option = cloneDeep(this.state.dyLawCaseOption);

        const legendData = ['总数', '未签批', '已签批', '已归档'];
        const legendField = ['TOTAL', 'NOTDORSEMENT', 'DORSEMENT', 'FILED'];

        option.legend = legendData;

        option.xAxisData = dyLawCase.map(item => {
            if (item.ORGAN_CODE) {
                return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
            }
            return item.SITE_NAME;
        });

        const series = [
            {
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
                data: []
            }
        ];

        const dySeries = cloneDeep(series);

        for (let i = 1; i < legendData.length; i++) {
            dySeries.push({
                name: legendData[i],
                type: 'bar',
                barMaxWidth: 10,
                data: dyLawCase.map(item => item[legendField[i]])
            })
        }
        dySeries[0].data = dyLawCase.map(item => item.TOTAL);
        option.series = dySeries;
        this.setState({
            dyLawCaseOption: option
        })
    }


    render() {
        const { dyLawCaseOption } = this.state;

        return JSON.stringify(dyLawCaseOption) !== '{}' ?
            <DyLawCase
                data={dyLawCaseOption}
            />
            : null;
    }
}
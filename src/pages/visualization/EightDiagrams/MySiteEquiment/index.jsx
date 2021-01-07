import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import cloneDeep from 'lodash.clonedeep';
import SiteEquiment from '../../components/SiteEquiment/index';
import { getLocalStorage } from '@/utils/utils';
import { areaAllName, areaAllCode } from '../../area.js';


/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading }) => ({
    BigScreen,
    loading: loading.models.BigScreen,
    currentUser: user.currentUser,
}))
export default class MySiteEquiment extends PureComponent {

    constructor(props) {
        super(props);
        this.organCode = getLocalStorage('organId') || 51;
    }
    state = {
        siteEquimentOption: {}
    }


    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'BigScreen/bigScreenSiteEquiment',
            payload: { organCode: this.organCode },
            callback: () => {
                // callback && callback();
                this.formatSiteEquiment();
            }
        })
    }

    /**
    * @description 格式化设备状态
    */
    formatSiteEquiment = () => {
        const { BigScreen: { siteEquiment } } = this.props;
        const option = cloneDeep(this.state.siteEquimentOption);

        const legendData = ['总数', '维修', '禁用', '正常'];
        const legendField = ['TOTAL', 'REPAIRING', 'PROHIBIT', 'NORMAL'];

        option.legend = legendData;

        option.xAxisData = siteEquiment.map(item => {
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
                data: siteEquiment.map(item => item[legendField[i]])
            })
        }
        dySeries[0].data = siteEquiment.map(item => item.TOTAL);
        option.series = dySeries;
        this.setState({
            siteEquimentOption: option
        })
    }


    render() {
        const { siteEquimentOption } = this.state;

        return JSON.stringify(siteEquimentOption) !== '{}' ?
            <SiteEquiment
                data={siteEquimentOption}
            />
            : null;
    }
}
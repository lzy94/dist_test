import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import SiteOverview from '../../components/SiteOverview/index';
import { getLocalStorage } from '@/utils/utils';


/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading }) => ({
    BigScreen,
    loading: loading.models.BigScreen,
    currentUser: user.currentUser,
}))
export default class MySiteOverview extends PureComponent {

    constructor(props) {
        super(props);
        this.organCode = getLocalStorage('organId') || 51;
    }
    state = {
        dySiteOverviewOption: {},
        statusSiteOverviewOption: {},
        sourceSiteOverviewOption: {}
    }


    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'BigScreen/siteOverview',
            payload: { organCode: this.organCode },
            callback: () => {
                // callback && callback();
                this.formatSiteOverviewData1();
                this.formatSiteOverviewData2();
                this.formatSiteOverviewData3();
            }
        })
    }


    getSiteCount = (list, field) => {
        let total = 0;
        for (let i = 0; i < list.length; i++) {
            total += list[i][field];
        }

        return total;
    }

    formatSiteOverviewData1 = () => {
        const { BigScreen: { siteOverviewData } } = this.props;
        const dySites = siteOverviewData.dySites;
        const option = cloneDeep(this.state.dySiteOverviewOption);
        const legendData = ['报废', '在用', '检修']; // 0 1 2
        const legendField = ['DISTORYED', 'WORKING', 'NOTWORKING'];
        option.xAxisData = legendData;
        const newDySites = legendField.map((item, index) => ({
            name: legendData[index],
            value: this.getSiteCount(dySites, item)
        }));

        const series = [{
            name: '动态站',
            type: 'pie',
            selectedMode: 'single',
            radius: ['55%', '65%'],
            label: {
                normal: {
                    show: true,
                    position: 'center',
                    lineHeight: 25,
                    formatter: () => {
                        const arr = [
                            `{a|${this.getSiteCount(dySites, 'TOTAL')}}`,
                            `{b|动态站总数}`
                        ];
                        return arr.join('\n');
                    },
                    rich: {
                        a: {
                            color: '#A2D4E6',
                            fontSize: 28
                        },
                        b: {
                            color: '#666',
                            fontSize: 12,
                            fontWeight: 400
                        }
                    }
                },
            },
            data: newDySites
        }];

        option.series = series;

        this.setState({ dySiteOverviewOption: option })

    }


    formatSiteOverviewData2 = () => {
        const { BigScreen: { siteOverviewData } } = this.props;
        const staticSites = siteOverviewData.staticSites;
        const option = cloneDeep(this.state.statusSiteOverviewOption);
        const legendData = ['报废', '在用', '检修']; // 0 1 2
        const legendField = ['DISTORYED', 'WORKING', 'NOTWORKING'];
        option.xAxisData = legendData;
        const newStaticSites = legendField.map((item, index) => ({
            name: legendData[index],
            value: this.getSiteCount(staticSites, item)
        }))

        const series = [{
            name: '静态站',
            type: 'pie',
            selectedMode: 'single',
            radius: ['55%', '65%'],
            label: {
                normal: {
                    show: true,
                    position: 'center',
                    lineHeight: 25,
                    formatter: () => {
                        const arr = [
                            `{a|${this.getSiteCount(staticSites, 'TOTAL')}}`,
                            `{b|静态站总数}`
                        ];
                        return arr.join('\n');
                    },
                    rich: {
                        a: {
                            color: '#A2D4E6',
                            fontSize: 28
                        },
                        b: {
                            color: '#666',
                            fontSize: 12,
                            fontWeight: 400
                        }
                    }
                },
            },
            data: newStaticSites
        }];


        option.series = series;

        this.setState({ statusSiteOverviewOption: option })

    };


    formatSiteOverviewData3 = () => {
        const { BigScreen: { siteOverviewData } } = this.props;
        const sourceConpany = siteOverviewData.sourceConpany;
        const option = cloneDeep(this.state.sourceSiteOverviewOption);
        const legendData = ['报废', '在用', '检修']; // 0 1 2
        const legendField = ['DISTORYED', 'WORKING', 'NOTWORKING'];
        option.xAxisData = legendData;
        const newSourceConpany = legendField.map((item, index) => ({
            name: legendData[index],
            value: this.getSiteCount(sourceConpany, item)
        }))

        const series = [{
            name: '源头',
            type: 'pie',
            selectedMode: 'single',
            radius: ['55%', '65%'],
            label: {
                normal: {
                    show: true,
                    position: 'center',
                    lineHeight: 25,
                    formatter: () => {
                        const arr = [
                            `{a|${this.getSiteCount(sourceConpany, 'TOTAL')}}`,
                            `{b|源头总数}`
                        ];
                        return arr.join('\n');
                    },
                    rich: {
                        a: {
                            color: '#A2D4E6',
                            fontSize: 28
                        },
                        b: {
                            color: '#666',
                            fontSize: 12,
                            fontWeight: 400
                        }
                    }
                },
            },
            data: newSourceConpany
        }];

        option.series = series;

        this.setState({ sourceSiteOverviewOption: option })

    }



    render() {
        const { dySiteOverviewOption, statusSiteOverviewOption, sourceSiteOverviewOption } = this.state;

        return (
            <div style={{ display: 'flex', height: '100%', flexWrap: 'wrap' }}>
                <div style={{ width: '50%', height: '50%' }}>
                    {JSON.stringify(dySiteOverviewOption) !== '{}' ? <SiteOverview data={dySiteOverviewOption} /> : null}
                </div>
                <div style={{ width: '50%', height: '50%' }}>
                    {JSON.stringify(statusSiteOverviewOption) !== '{}' ? <SiteOverview data={statusSiteOverviewOption} /> : null}
                </div>
                <div style={{ width: '100%', height: '50%' }}>
                    {JSON.stringify(sourceSiteOverviewOption) !== '{}' ? <SiteOverview data={sourceSiteOverviewOption} /> : null}
                </div>
            </div>
        );
    }
}

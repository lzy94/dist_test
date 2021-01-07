import { PureComponent } from 'react';
import cloneDeep from 'lodash.clonedeep';
import ReactEcharts from 'echarts-for-react';
// import Pie from './Pie';

export default class MyPie extends PureComponent {
  static defaultProps = {
    data: {},
  };

  state = {
    option: {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        x: 'center',
        itemWidth: 16,
        itemHeight: 10,
        textStyle: {
          color: '#59BAF2',
        },
        data: [],
      },
    },
  };

  componentDidMount() {
    // this.getOption();
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    this.getOption(nextProps.data);
  }

  getOption = data => {
    // const { data } = this.props;
    const option = cloneDeep(this.state.option);
    option.legend = {
      orient: 'vertical',
      right: 10,
      itemWidth: 14,
      itemHeight: 14,
    };
    option.color = ['#5078FC', '#FEA735'];
    const name = ['完成', '未完成'];

    const newData = data.map((item, index) => ({
      name: name[index],
      value: item.TOTAL,
    }));
    const series = [
      {
        name: '养护统计',
        type: 'pie',
        // selectedMode: 'single',
        // radius: ['50%', '70%'],
        center: ['30%', '50%'],
        label: {
          normal: {
            show: false,
            // position: 'center',
            // lineHeight: 25,
            // formatter: () => {
            //   const arr = [
            // `{a|${this.getSiteCount(dySites, 'TOTAL')}}`,
            //     `{b|动态站总数}`,
            //   ];
            //   return arr.join('\n');
            // },
            // rich: {
            //   a: {
            //     color: '#A2D4E6',
            //     fontSize: 28,
            //   },
            //   b: {
            //     color: '#666',
            //     fontSize: 12,
            //     fontWeight: 400,
            //   },
            // },
          },
        },
        data: newData,
      },
    ];
    option.series = series;

    this.setState({ option });
  };

  render() {
    const { option } = this.state;
    return Object.keys(option).length ? (
      <div style={{ height: 174 }}>
        <ReactEcharts option={option} style={{ height: '100%' }} />
      </div>
    ) : null;
  }
}

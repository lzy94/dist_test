/* eslint-disable react/jsx-filename-extension */
import React, { PureComponent } from 'react';
import { DatePicker, message, Form } from 'antd';
import moment from 'moment';
import publicCss from '@/pages/style/public.less';

class MyDatePicker extends PureComponent {
  state = {
    startTime: null,
    endTime: null,
    // startOpen: false,
    endOpen: false,
    prevPropVlaue: [],
  };

  // onChange = (field, value, callback) => {
  //   this.setState(
  //     {
  //       [field]: value,
  //     },
  //     () => callback && callback(),
  //   );
  // };

  // // eslint-disable-next-line react/sort-comp
  // disabledStartDate = startTime => {
  //   const { endTime } = this.state;
  //   if (!startTime || !endTime) {
  //     return false;
  //   }
  //   console.log(startTime.valueOf() > endTime.valueOf(), '---');
  //   return startTime.valueOf() > endTime.valueOf();
  // };

  // disabledEndDate = endTime => {
  //   const { startTime } = this.state;
  //   if (!endTime || !startTime) {
  //     return false;
  //   }
  //   console.log(endTime.valueOf() <= startTime.valueOf(), '++++');
  //   return endTime.valueOf() <= startTime.valueOf();
  // };

  formatDate = value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null);

  // onStartChange = value => {
  //   this.onChange('startTime', value);
  //   const { getValue } = this.props;
  //   const { endTime } = this.state;
  //   if (!value) {
  //     // this.onChange('endTime', null,()=>{
  //     getValue([null, null]);
  //     // });
  //   } else {
  //     getValue([this.formatDate(value), this.formatDate(endTime)]);
  //   }
  // };

  // onEndChange = value => {
  //   this.onChange('endTime', value);
  //   const { getValue } = this.props;
  //   const { startTime } = this.state;
  //   if (!value) {
  //     getValue([null, null]);
  //     // this.onChange('startTime', null,()=>{});
  //   } else {
  //     getValue([this.formatDate(startTime), this.formatDate(value)]);
  //   }
  // };

  // handleStartOpenChange = open => {
  //   if (!open) {
  //     this.onChange('endOpen', true);
  //   }
  // };

  // handleEndOpenChange = open => {
  //   this.setState({ endOpen: open });
  //   const { startTime, endTime } = this.state;
  //   if (!open && !startTime) {
  //     message.error('请先选择开始时间');
  //     this.onChange('endTime', null);
  //   }
  // };

  getTimeValue = e => {
    const { getValue } = this.props;
    getValue([this.formatDate(e[0]), this.formatDate(e[1])]);
  };

  // static getDerivedStateFromProps(props, state) {
  //   const { value } = props;
  //   if (JSON.stringify(value) !== JSON.stringify(state.prevPropVlaue)) {
  //     return {
  //       startTime: value[0] ? moment(new Date(value[0])) : null,
  //       endTime: value[1] ? moment(new Date(value[1])) : null,
  //       prevPropVlaue: value,
  //     };
  //   }
  //   return null;
  // }

  render() {
    // const { startTime, endTime, startOpen, endOpen } = this.state;
    return (
      <div className={publicCss.myDate}>
        <DatePicker.RangePicker
          onChange={this.getTimeValue}
          style={{ width: '100%' }}
          showTime={{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment(new Date(), 'HH:mm:ss')],
          }}
          format="YYYY-MM-DD HH:mm:ss"
        />
        {/* <DatePicker
          style={{ flex: 1, minWidth: 'auto' }}
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="开始时间"
          value={startTime}
          // open={startOpen}
          onOk={this.getValue}
          disabledDate={this.disabledStartDate}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          showTime
        />
        <span className={publicCss.split}>~</span>
        <DatePicker
          style={{ flex: 1, minWidth: 'auto' }}
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="结束时间"
          value={endTime}
          open={endOpen}
          onOk={this.getValue}
          disabledDate={this.disabledEndDate}
          onChange={this.onEndChange}
          onOpenChange={this.handleEndOpenChange}
          showTime
        /> */}
      </div>
    );
  }
}
export default MyDatePicker;

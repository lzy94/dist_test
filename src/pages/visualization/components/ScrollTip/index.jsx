import React, { PureComponent } from 'react';

import style from '../../style.less';

export default class ScrollTip extends PureComponent {

    state = {
        tipMsg: '',
        newTipMsg: '',
        oldTipMsg: ''
    }


    static getDerivedStateFromProps(props, state) {
        const { tipMsg } = props;
        if (tipMsg !== state.tipMsg) {
            let newTipMsg = tipMsg;
            let oldTipMsg = state.tipMsg ? state.tipMsg : tipMsg;
            // if (oldTipMsg !== newTipMsg) {
            //     newTipMsg = oldTipMsg;
            // } else {
            //     oldTipMsg = newTipMsg;
            // }
            return {
                tipMsg,
                newTipMsg,
                oldTipMsg,
            };
        }
        return null;
    }

    render() {
        const { newTipMsg, oldTipMsg } = this.state;
        return <div className={`${style.tip} ${newTipMsg !== oldTipMsg ? style.active : ''}`}>
            <span className={style.msg}>{oldTipMsg}</span>
            <span className={style.msg}>{newTipMsg}</span>
        </div>;
    }
}
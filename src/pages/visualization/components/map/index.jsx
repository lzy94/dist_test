import React from 'react';
import BaseChart from '../BaseChart';
import option from './option';
import getOption from './getOption';

/**
 * @description echart 地图父类
 * @export
 * @class Map
 * @extends {BaseChart}
 */
export default class Map extends BaseChart {
    static defaultProps = {
        option,
        getOption
    }
}

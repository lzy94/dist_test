import React, { PureComponent } from 'react';
import BaseChart from '../BaseChart';
import option from '../option';
import getOption from './getOption';


export default class DyLaw extends BaseChart {
    static defaultProps = {
        option,
        getOption
    }
}
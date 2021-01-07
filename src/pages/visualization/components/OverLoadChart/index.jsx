import React from 'react';
import BaseChart from '../BaseChart';
import option from '../option';
import getOption from './getOption';

export default class OverLoadChart extends BaseChart {
  static defaultProps = {
    option,
    getOption,
  };
}

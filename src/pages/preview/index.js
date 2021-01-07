import React, {PureComponent} from 'react';
// import {Document,pdfjs  } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = '../../assets/pdf.worker.js';
import PDF from 'react-pdf-js';

class Preview extends PureComponent {

  state = {
    url: ''
  }

  componentDidMount() {
    window.addEventListener('message', (event) => {
      this.setState({url: event.data.pdfUrl})
    })
  }

  render() {
    const {url} = this.state;
    return (
      <PDF file='/pdf/admin/2019/7/10081071.pdf'></PDF>
    );

  }
}


export default Preview;

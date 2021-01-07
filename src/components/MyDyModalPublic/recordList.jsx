import React from 'react';
import StandardTable from '@/components/StandardTable';

// export default class RecordList extends Component {
//   render() {
//     const { loading, list, columns } = this.props;
//     return (
//       <StandardTable
//         tableAlert={false}
//         size="small"
//         selectedRows={0}
//         rowSelection={null}
//         loading={loading}
//         data={{
//           list: list.length ? list : [],
//           pagination: {},
//         }}
//         pagination={false}
//         columns={columns}
//       />
//     );
//   }
// }

const RecordList = props => {
  const { loading, list, columns } = props;
  return (
    <StandardTable
      tableAlert={false}
      size="small"
      selectedRows={0}
      rowSelection={null}
      loading={loading}
      data={{
        list: list.length ? list : [],
        pagination: {},
      }}
      pagination={false}
      columns={columns}
    />
  );
};

export default RecordList;

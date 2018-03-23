import React, { Component } from 'react';
import { Table } from 'react-materialize';
import * as consts from '../../const';

class ResultTable extends Component {

  createTableList(item) {
    return (
      <tr key={Math.random()}>
        <td>{item.message}</td>
        <td>{item.file.name}</td>
        {item.message === consts.SUCCESS ?
          <td><a href={item.url}>DL</a></td> :
          <td>-</td>
        }
      </tr>
    );
  }

  render() {
    const { items } = this.props;
    const tablelist = [];
    items.forEach((item) => {
      tablelist.push(this.createTableList(item));
    });

    return (
      <Table>
        <thead>
          <tr>
            <th data-field="id">Status</th>
            <th data-field="name">File Name</th>
            <th data-field="dl">Download</th>
          </tr>
        </thead>
        <tbody>
          {tablelist}
        </tbody>
      </Table>
    );
  }
}

//他の場所で読み込んで使えるようにexport
export default ResultTable;
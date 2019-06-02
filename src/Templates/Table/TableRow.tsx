import React, { Component } from 'react';

export interface TableRowProps {
  title: string;
}

export default class TableRow extends Component<TableRowProps, any> {
  public render() {
    return (
      <div className="table-row">
        <h4>{this.props.title}</h4>
        {this.props.children}
      </div>
    );
  }
}
import React, { Component, ReactNode, ReactNodeArray } from 'react';

export interface TableRowProps {
  title: string;
  children: ReactNode|ReactNodeArray;
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
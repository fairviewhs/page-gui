import React, { Component, ReactNode, ReactNodeArray } from 'react';

export interface TableProps {
  title: string;
  children: ReactNode|ReactNodeArray;
}

export default class Table extends Component<TableProps, any> {
  public render() {
    return (
      <div className="t-table">  
        <h2>{this.props.title}</h2>
        <div className="t-table-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
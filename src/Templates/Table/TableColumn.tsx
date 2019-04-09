import React, { Component } from 'react';

export interface TableColumnProps {
}

export default class TableColumn extends Component<TableColumnProps, any> {
  public render() {
    return (
      <div className="t-table-col">
      {/* More applicant information, including family, demographics (optional), educational, self-reported test scores, and activity lists. */}
        <p>{this.props.children}</p>
      </div>
    );
  }
}
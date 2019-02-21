import React, { Component } from 'react';

export interface CheckListSummaryProps {
}

export default class CheckListSummary extends Component<CheckListSummaryProps, any> {
  public render() {
    return (
      <div className="t-checklist-sum">
        {this.props.children}
      </div>
    );
  }
}
import React, { Component } from 'react';

export interface CheckListCriteriaProps {
}

export default class CheckListCriteria extends Component<CheckListCriteriaProps, any> {
  public render() {
    return (
      <ul className="t-checklist-crit">
        {this.props.children}
      </ul>
    );
  }
}
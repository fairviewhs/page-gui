import React, { Component } from 'react';

export interface CheckListProps {
}

export default class CheckList extends Component<CheckListProps, any> {
  public render() {
    return (
      <div className="t-checklist">
        {this.props.children}
      </div>
    );
  }
}
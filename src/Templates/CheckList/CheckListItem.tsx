import React, { Component } from 'react';

export interface CheckListItemProps {
}

export default class CheckListItem extends Component<CheckListItemProps, any> {
  public render() {
    return (
      <div>
        <li className="t-checklist-item">
          <div className="t-checklist-box"></div>
          {this.props.children}
        </li>
      </div>
    );
  }
}
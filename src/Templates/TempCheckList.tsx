import React, { Component } from 'react';

export interface TempCheckListProps {
  checkboxItems: {name: string}[];
}

export default class TempCheckList extends Component<TempCheckListProps, any> {
  public render() {
    const { checkboxItems } = this.props;

    // TODO: FIX
    const checkItems = checkboxItems.map(item => (
      <li className="t-checklist-item">
        <div className="t-checklist-box"/>
        {item.name}
      </li>
    ))

    return (
      <div className="t-checklist">
        <div className="t-checklist-sum">
          Write summary here.
        </div>
        <ul className="t-checklist-crit">
          {checkItems}
        </ul>
      </div>
    );
  }
}
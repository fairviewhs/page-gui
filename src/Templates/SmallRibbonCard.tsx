import React, { Component } from 'react';

export interface SmallRibbonCardProps {
  title: string;
}

export default class SmallRibbonCard extends Component<SmallRibbonCardProps, any> {
  public render() {
    const { title, children } = this.props;
    return (
      <div className="t-ribbon-2-card">
        <h3 className="t-ribbon-2">
          {title}
        </h3>
        <div className="t-ribbon-2-card-txt">
          {children}
        </div>
      </div>
    );
  }
}
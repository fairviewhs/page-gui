import React, { Component } from 'react';

export interface TitleCardProps {
  title: string;
}

export default class TitleCard extends Component<TitleCardProps, any> {
  public render() {
    const { title, children } = this.props;
    return (
      <div className="t-card-cont">
        <h2>{title}</h2>
        <div className="t-card-cont-stuff">
          {children}
        </div>
      </div>
    );
  }
}
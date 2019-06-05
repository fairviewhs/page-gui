import React, { Component } from 'react';

export interface CardProps {
}

export default class Card extends Component<CardProps, any> {
  public render() {
    return (
      <div className="t-card">
        {this.props.children}
      </div>
    );
  }
}
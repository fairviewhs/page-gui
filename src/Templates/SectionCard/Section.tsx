import React, { Component } from 'react';

export interface SectionProps {
}

export default class Section extends Component<SectionProps, any> {
  public render() {
    return (
      <div className="t-ribbon-sect">
        {this.props.children}
      </div>
    );
  }
}
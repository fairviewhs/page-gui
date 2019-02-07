import React, { Component } from 'react';

export interface SectionCardProps {
}

export default class SectionCard extends Component<SectionCardProps, any> {
  public render() {
    return (
      <div className="t-ribbon-sect-card">
        {this.props.children}
      </div>
    );
  }
}
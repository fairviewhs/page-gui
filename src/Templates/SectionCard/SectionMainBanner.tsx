import React, { Component } from 'react';

export interface SectionMainBannerProps {
}

export default class SectionMainBanner extends Component<SectionMainBannerProps, any> {
  public render() {
    return (
      <h1 className="t-ribbon-3">
        {this.props.children}
      </h1>
    );
  }
}
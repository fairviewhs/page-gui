import React, { Component } from 'react';

export interface SectionSubBannerProps {
}

export default class SectionSubBanner extends Component<SectionSubBannerProps, any> {
  public render() {
    return (
      <h3 className="t-ribbon-4">
        {this.props.children}
      </h3>
    );
  }
}
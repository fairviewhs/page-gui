import React, { Component } from 'react';

export interface RibbonProps {
}

export default class Ribbon extends Component<RibbonProps, any> {
  public render() {
    return (
      <div className="t-ribbon-1">
        <div className="t-ribbon-1-tl" />
        <div className="t-ribbon-1-tr" />
        <h1>{this.props.children}</h1>
      </div>
    );
  }
}
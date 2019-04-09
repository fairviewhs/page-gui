import React, { Component } from 'react';

export interface LinkProps {
  url: string;
  red: boolean;
}

export default class Link extends Component<LinkProps, any> {
  public render() {
    const className = this.props.red ? 't-red-btn' : '';
    return (
      <a href={this.props.url} className={className}>{this.props.children}</a>
    );
  }
}
import React, { Component, Fragment } from 'react';
import { BaseComponentRenderProps } from '../types';

export default class BooleanRender extends Component<BaseComponentRenderProps<string>, any> {
  public render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}
import React, { Component } from 'react';

import StringRender from '../BaseComponents/StringRender'

export interface ImageProps{
  url: StringRender;
}

export default class Image extends Component<ImageProps, any> {
  public render() {
    return (
      <img src={this.props.url.props.children} className="paddedImage"></img>
    );
  }
}
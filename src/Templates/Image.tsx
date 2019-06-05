import React, { Component } from 'react';

export interface ImageProps{
  url: string;
}

export default class Image extends Component<ImageProps, any> {
  public render() {
    return (
      <img src={this.props.url} className="paddedImage"></img>
    );
  }
}
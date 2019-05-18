import React, { Component } from 'react';

export interface TextProps{
  text: string;
}

export default class Text extends Component<TextProps, any> {
  public render() {
    return (
      <p className="paddedText">
        {this.props.text}
      </p>
    );
  }
}
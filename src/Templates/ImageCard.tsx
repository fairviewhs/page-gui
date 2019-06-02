import React, { Component } from 'react';

export interface ImageCardProps {
  url: string;
}

export default class ImageCard extends Component<ImageCardProps, any> {
  public render() {
    const { url, children } = this.props;
    return (
      <div className="t-img-card">
        <img src={url} />
        <div className="t-img-card-txt">
          {children}
        </div>
      </div>
    );
  }
}
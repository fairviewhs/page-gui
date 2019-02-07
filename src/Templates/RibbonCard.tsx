import React, { Component } from 'react';

export interface RibbonCardProps {
  title: string;
  noTop?: boolean;
}

export default class RibbonCard extends Component<RibbonCardProps, any> {

  static defaultProps = {
    noTop: false
  }

  public render() {
    const { title, noTop, children } = this.props;
    const type = noTop ? 't-ribbon-1-card-2' : 't-ribbon-1-card';
    return (
      <div className={type}>
        <div className="t-ribbon-1 t-ribbon-1-wrap">
          <div className="t-ribbon-1-tl" />
          <div className="t-ribbon-1-tr" />
          <h1>{title}</h1>
        </div>
        <div className="t-ribbon-1-card-txt">
          {children}
        </div>
      </div>
    );
  }
}
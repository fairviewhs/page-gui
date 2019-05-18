import React, { ReactNode, Component, ReactNodeArray } from 'react';

export interface CardGroupProps {
  children: ReactNode|ReactNodeArray;
}

export default class CardGroup extends Component<CardGroupProps, any> {

  public render() {
    const { children } = this.props;

    return (
      <div className="cardGroup">
        {children}
      </div>
    );
  }
}

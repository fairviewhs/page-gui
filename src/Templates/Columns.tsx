import React, { ReactNode, Component, ReactNodeArray } from 'react';

export interface ColumnsProps {
  children: ReactNode|ReactNodeArray;
}

export default class Columns extends Component<ColumnsProps, any> {

  public render() {
    const { children } = this.props;

    return (
      <div className="columns">
        {children}
      </div>
    );
  }
}

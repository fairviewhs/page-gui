import React, { ReactNode, Component, ReactNodeArray } from 'react';

export interface ColumnProps {
  children: ReactNode|ReactNodeArray;
}

export default class Column extends Component<ColumnProps, any> {

  public render() {
    const { children } = this.props;

    return (
      <div className="column">
          {children}
      </div>
    );
  }
}

import React, { Component, Fragment } from 'react';

export default class Root extends Component {

  public render() {
    return (
      <Fragment>
        {this.props.children}
      </Fragment>
    );
  }
}
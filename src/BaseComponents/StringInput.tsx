import React, { Component, ChangeEvent } from 'react';
import { BasicInputComponent } from '../types';

export default class StringInput extends Component<BasicInputComponent<string>> {
  handleChange = (event: ChangeEvent<HTMLInputElement>) => 
    this.props.onChange(event.target.value);

  public render() {
    return (
      <input type="string" value={this.props.value} onChange={this.handleChange} />
    );
  }
}
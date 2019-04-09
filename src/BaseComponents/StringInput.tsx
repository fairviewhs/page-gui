import React, { Component, ChangeEvent } from 'react';
import { BaseComponentInputProps } from '../types';

export default class StringInput extends Component<BaseComponentInputProps<string>> {
  handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(event.target.value); 
  public render() {
    return (
      <input type="string" value={this.props.value} onChange={this.handleChange} />
    );
  }
}
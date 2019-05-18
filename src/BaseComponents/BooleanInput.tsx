import React, { Component, ChangeEvent } from 'react';
import { BaseComponentInputProps } from '../types';

export default class BooleanInput extends Component<BaseComponentInputProps<boolean>> {
  handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(event.target.checked);
  public render() {
    return (
      <input type="checkbox" checked={this.props.value} onChange={this.handleChange} />
    );
  }
}
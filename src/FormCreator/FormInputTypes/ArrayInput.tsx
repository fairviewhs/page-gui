import React, { Component, ChangeEvent } from 'react';
import { ArrayProperty } from '../../types';

export interface ArrayInputProps {
  onChange: (index: number, value: any) => any;
  properties: ArrayProperty;
  values: any[];
}

export default class ArrayInput extends Component<ArrayInputProps, any> {

  handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(index, event.target.value);

  public render() {
    const { properties, values } = this.props;

    const inputs = properties.map((type, index) => (
      <input type="text" value={values[index]} onChange={this.handleChange(index)} />
    ))

    return (
      <div>
        {inputs}
      </div>
    );
  }
}
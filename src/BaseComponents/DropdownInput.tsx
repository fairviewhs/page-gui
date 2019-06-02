import React, { Component, ChangeEvent } from 'react';
import { BasicInputComponent } from '../types';
import Select from 'react-select';

export default function makeDropdownInput(options: string[]){
  return class extends Component<BasicInputComponent<string>, any> {

    handleChange = (selected) =>
      this.props.onChange(selected.value);
    
    public render(){
      const select_options = options.map(name => ({
        value: name,
        label: name
      }));

      return (
        <Select menuPlacement="top"
          options={select_options}
          value={select_options.find(option => option.value === this.props.value)}
          onChange={this.handleChange}
        />
      );
    }
  }
}
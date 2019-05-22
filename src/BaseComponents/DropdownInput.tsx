import React, { Component, ChangeEvent } from 'react';
import { BaseComponentInputProps } from '../types';
import Select from 'react-select';

/*export default class StringInput extends Component<BaseComponentInputProps<string>> {
  handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(event.target.value); 
  public render() {
    return (
      <input type="string" value={this.props.value} onChange={this.handleChange} />
    );
  }
}*/

export default function makeDropdownInput(options: string[]){
  return class extends Component<BaseComponentInputProps<string>, any> {
    /*handleChange = (event: ChangeEvent<HTMLInputElement>) =>
      this.props.onChange(event.target.value);*/
      handleChange = (selected) => {
        this.setState({ selected });
        this.props.onChange(selected.value);
      }

    state = {
      selected : null
    }
    
    public render(){
      const select_options = options.map(name => ({
        value: name,
        label: name
      }));

      return (
        <Select menuPlacement="top"
          options={select_options}
          value={this.state.selected }
          onChange={this.handleChange}
        />
      );
    }
  }
}
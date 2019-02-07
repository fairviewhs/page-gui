import React, { Component, FormEvent, ChangeEvent } from 'react';
import { ComponentStructure } from './FormCreator';

export interface AddNewInputProps {
  onNewComponent: (componentName: string) => any;
  componentTypes: ComponentStructure[];
}

export interface AddNewInputState {
  selected: null | string;
}

export default class AddNewInput extends Component<AddNewInputProps, AddNewInputState> {

  state = {
    selected: ''
  }

  handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selected: event.target.value });
  }

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { selected } = this.state;
    const componentInfo = this.props.componentTypes.find(value => value.name === selected);
    if (!!componentInfo) {
      this.props.onNewComponent(selected);
    }
  }

  public render() {
    const options = this.props.componentTypes.map(info => (
      <option key={info.name} value={info.name}>{info.name}</option>
    ));
    console.log(options)
    return (
      <form onSubmit={this.handleSubmit}>
        <select value={this.state.selected} onChange={this.handleChange}>
          {options}
        </select>
        <button type="submit">Add</button>
      </form>
    );
  }
}
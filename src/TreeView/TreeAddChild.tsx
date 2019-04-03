import React, { Component, ChangeEvent, FormEvent } from 'react';
import { ComponentStructure } from '../types';

export interface TreeAddChildProps {
  onAddComponent: (componentName: string) => any;
  componentStructures: ComponentStructure[];
}

export interface TreeAddChildState {
  selected: string;
}

export default class TreeAddChild extends Component<TreeAddChildProps, TreeAddChildState> {
  state: TreeAddChildState = {
    selected: ''
  }

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let { selected } = this.state;
    if (!selected) {
      console.warn(`Select element in TreeAddChild was not found`);
      selected = this.props.componentStructures[0].name;
    };
    const componentInfo = this.props.componentStructures.find(value => value.name === selected);
    if (!!componentInfo) {
      this.props.onAddComponent(selected);
    }
  }

  handleChange = (event: ChangeEvent<HTMLSelectElement>) =>
    this.setState({ selected: event.target.value });

  public render() {
    const options = this.props.componentStructures.map(info => (
      <option
        key={info.name}
        value={info.name}
      >
        {info.name}
      </option>
    ));
    return (
      <form onSubmit={this.handleSubmit}>
        <select onChange={this.handleChange}>
          {options}
        </select>
        <button type="submit">Add</button>
      </form>
    );
  }
}
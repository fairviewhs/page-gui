import React, { Component, ChangeEvent, FormEvent, Fragment } from 'react';
import { ComponentStructure } from '../types';
import Select from 'react-select';

export interface TreeAddChildProps {
  onAddComponent: (componentName: string) => any;
  componentStructures: ComponentStructure[];
}

export interface TreeAddChildState {
  selected: null | { label: string, value: string };
}

export default class TreeAddChild extends Component<TreeAddChildProps, TreeAddChildState> {
  state: TreeAddChildState = {
    selected: null
  }

  handleAdd = () => {
    const { selected } = this.state;
    if (!!selected) {
      const componentInfo = this.props.componentStructures.find(value => value.name === selected.value);
      if (!!componentInfo) {
        this.props.onAddComponent(selected.value);
        this.setState({ selected: null });
      }
    }
  }

  handleChange = (selected) => {
    this.setState({ selected });
  }

  public render() {
    const options = this.props.componentStructures.map(info => ({
      value: info.name,
      label: info.name
    }));
    return (
      <Fragment>
        <Select 
          value={this.state.selected}
          onChange={this.handleChange}
          options={options}
        />
        <button onClick={this.handleAdd}>Add Component</button>
      </Fragment>
    );
  }
}
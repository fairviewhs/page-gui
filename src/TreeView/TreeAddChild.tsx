import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { Structure } from '../types';

export interface TreeAddChildProps {
  onAddComponent: (id: string) => any;
  componentStructures: Structure[];
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
        this.props.onAddComponent(componentInfo.id);
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
        <Select menuPlacement="top"
          value={this.state.selected}
          onChange={this.handleChange}
          options={options}
        />
        <button onClick={this.handleAdd}>Add Component</button>
      </Fragment>
    );
  }
}
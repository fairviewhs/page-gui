import React, { Component, Fragment } from 'react';
import { ComponentId, GeneratedComponent, ComponentStructure } from '../types';

import styles from './TreeView.module.css';
import { isString, has } from 'lodash';

export interface TreeViewProps {
  onSelect: (id: ComponentId) => any;
  selectedId: ComponentId;
  componentList: GeneratedComponent[];
  componentTypes: ComponentStructure[];
}

export default class TreeView extends Component<TreeViewProps, any> {

  handleSelect = (id: ComponentId) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevents parent component from being selected
    event.stopPropagation();
    this.props.onSelect(id);
  };

  findComponentStructure = (values: ComponentStructure[], find: (value: ComponentStructure) => boolean): ComponentStructure | null => {
    const surface = values.find(value => find(value));
    if (!!surface) return surface;
    return values.reduce((prevFound: null | ComponentStructure, value) => {
      if (!!prevFound) return prevFound;
      return Object.values(value.propertyTypes)
        .reduce((foundValue: ComponentStructure | null, value) => {
          // if value is a string then it is a baseComponent, thus we can't go deeper
          if (!!foundValue || isString(value) || (!isString(value) && !has(value, 'custom'))) return foundValue;
          return this.findComponentStructure(value.custom as ComponentStructure[], find);
        }, null);
    }, null);
  }

  public render() {
    const list = this.props.componentList.map(component => {
      const subTree = Object.entries(component.values)
        .filter(([propName, value]) => Array.isArray(value))
        .map(([propName, value]) => (
          <div className={styles.indent} key={propName}>
            <TreeView
              componentList={value as GeneratedComponent[]}
              componentTypes={this.props.componentTypes}
              onSelect={this.props.onSelect}
              selectedId={this.props.selectedId}
            />
          </div>
        ));
      const structure = this.findComponentStructure(this.props.componentTypes, type => type.id === component.componentType);
      if (!structure) throw new TypeError(`Component type "${component.componentType}" was not found.`)
      // Change styling if this component is selected
      const itemStyle = component.id === this.props.selectedId ? `${styles.item} ${styles.selected}` : styles.item;
      return (
        <div className={itemStyle} key={component.id} onClick={this.handleSelect(component.id)}>
          <h1>{structure.name}</h1>
          {subTree}
        </div>
      );
    });
    return (
      <Fragment>
        {list}
      </Fragment>
    );
  }
}
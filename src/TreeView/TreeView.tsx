import React, { Component, Fragment } from 'react';
import { ComponentId, GeneratedComponent, ComponentStructure } from '../types';

import styles from './TreeView.module.css';

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

  public render() {
    const list = this.props.componentList.map(component => {
      const subTree = Object.values(component.values)
        .filter(value => Array.isArray(value))
        .map(value => (
          <div className={styles.indent}>
            <TreeView
              componentList={value as GeneratedComponent[]}
              componentTypes={this.props.componentTypes}
              onSelect={this.props.onSelect}
              selectedId={this.props.selectedId}
            />
          </div>
        ));
      // Change styling if this component is selected
      const itemStyle = component.id === this.props.selectedId ? `${styles.item} ${styles.selected}` : styles.item;
      return (
        <div className={itemStyle} key={component.id} onClick={this.handleSelect(component.id)}>
          <h1>{component.name}</h1>
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
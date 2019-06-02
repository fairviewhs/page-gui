import React, { Component, Fragment } from 'react';

import styles from './TreeView.module.css';
import { GeneratedComponent } from '../GeneratedComponent';
import { Structure } from '../types';

export interface TreeViewProps {
  onSelect: (id: string) => any;
  selectedId: string;
  componentList: GeneratedComponent[];
  componentTypes: Structure[];
}

export default class TreeView extends Component<TreeViewProps, any> {

  handleSelect = (id: string) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevents parent component from being selected
    event.stopPropagation();
    this.props.onSelect(id);
  };

  public render() {
    const list = this.props.componentList.map(component => {
      const subTree = Object.entries(component.values)
        .filter(([propName, value]) => Array.isArray(value))
        .map(([propName, value]) => (
          <div className={styles.indent} key={propName}>
            <TreeView
              componentList={value}
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
          <h2> <b/>  &nbsp; {component.structure.name} </h2>
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

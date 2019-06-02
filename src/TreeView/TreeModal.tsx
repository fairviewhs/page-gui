import React, { Component, Fragment } from 'react';
import TreeAddChild from './TreeAddChild';

import styles from './TreeModal.module.css';
import { observer } from 'mobx-react';
import { GeneratedComponent } from '../GeneratedComponent';
import { Structure, BasicInputDefinition, BasicInput } from '../types';
import { isPlainObject } from 'lodash';

export interface TreeModalProps {
  onAddComponent: (componentName: string, propName?: string) => any;
  onChange: (propName: string, value: any) => any;
  onDelete: () => any;
  childComponentStructures: { [propName: string]: Structure[] };
  component: GeneratedComponent;
}

@observer
class TreeModal extends Component<TreeModalProps, any> {
  
  handleChange = (propName: string) => (value: any) => 
    this.props.onChange(propName, value);

  getBaseInputs = (): { propertyName: string, input: JSX.Element }[] => {
    const { values, structure } = this.props.component;
    return Object.entries(structure.basicInputProps)
      .map(([propertyName, basicInput]) => {
        const value = values[propertyName];
        const Input: BasicInput<any> = isPlainObject(basicInput) ? (basicInput as BasicInputDefinition<any>).render : basicInput as BasicInput<any>;

        return {
          propertyName,
          input: <Input value={value} onChange={this.handleChange(propertyName)} />
        }
      });
  }

  public render() {
    const structure = this.props.component.structure;

    const handleParentComponentAdd = (propName: string) => (componentName: string) => this.props.onAddComponent(componentName, propName);

    const componentValuesEl = Object.keys(structure.componentListProps)
      .map(propertyName => (
        <Fragment>
          <h3>Value {propertyName}</h3>
          <TreeAddChild
            onAddComponent={handleParentComponentAdd(propertyName)}
            componentStructures={this.props.childComponentStructures[propertyName]}
          />
        </Fragment>
      ));

    return (
      <div className={styles.modal}>
        <h2>Edit "{structure.name}" Component </h2>
        <button onClick={this.props.onDelete}>Delete</button>
        <h3>Values:</h3>
        {this.getBaseInputs().map(({ propertyName, input }) => (
          <Fragment key={propertyName}>
            <h3>{propertyName}</h3>
            {input}
          </Fragment>
        ))}
        {componentValuesEl}
      </div>
    );
  }
}

export default TreeModal;
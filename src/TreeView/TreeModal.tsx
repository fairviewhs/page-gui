import React, { Component, Fragment } from 'react';
import TreeAddChild from './TreeAddChild';
import { isString } from 'lodash';

import styles from './TreeModal.module.css';
import { ComponentStructure, GeneratedComponent } from '../types';
import { inject, observer } from 'mobx-react';
import { BaseComponentStore } from '../stores/BaseComponent.store';

export interface TreeModalProps {
  onAddComponent: (componentName: string, propName?: string) => any;
  onChange: (propName: string, value: any) => any;
  onDelete: () => any;
  baseComponentStore: BaseComponentStore;
  componentStructure: ComponentStructure;
  childComponentStructures: { [propName: string]: ComponentStructure[] };
  component: GeneratedComponent;
}

@observer
class TreeModal extends Component<TreeModalProps, any> {
  handleChange = (propName: string) => (value: any) => this.props.onChange(propName, value);

  public render() {
    const { values } = this.props.component;
    const baseComponentValuesEl = Object.entries(this.props.componentStructure.propertyTypes)
      .reduce((prevBaseProps: JSX.Element[], [propName, type]) => {
        // if type is not a string then it is a component/list
        if (!isString(type)) return prevBaseProps;
        const baseComponent = this.props.baseComponentStore.baseComponents.find(base => base.name === type);
        if (!baseComponent) {
          // TODO: log only on dev?
          console.warn(`Base Component for type "${type}" was not found in base components.`);
          return prevBaseProps;
        }
        const value = values[propName];
        const element = (
          <Fragment key={propName}>
            <h3>Value "{propName}":</h3>
            <baseComponent.inputComponent
              onChange={this.handleChange(propName)}
              value={value}
            />
          </Fragment>
        );
        return [
          ...prevBaseProps,
          element
        ];
      }, [] as JSX.Element[]);
    
    const handleParentComponentAdd = (propName: string) => (componentName: string) => this.props.onAddComponent(componentName, propName);

    const componentValuesEl = Object.entries(this.props.componentStructure.propertyTypes)
      .reduce((prevValueEls: JSX.Element[], [ propName, type ]) => {
        if (type === 'component') {
          return [
            ...prevValueEls,
            <Fragment>
              <h3>Value "{propName}":</h3>
              <TreeAddChild
                onAddComponent={handleParentComponentAdd(propName)}
                componentStructures={this.props.childComponentStructures[propName]}
              />
            </Fragment>
          ]
        } else if (!isString(type)) { // type is a ComponentProperty
          return [
            ...prevValueEls,
            <Fragment>
              <h3>Value "{propName}":</h3>
              <TreeAddChild
                onAddComponent={handleParentComponentAdd(propName)}
                componentStructures={this.props.childComponentStructures[propName]} //TODO: fix for custom / allowed
              />
            </Fragment>
          ]
        }
        return prevValueEls;
      }, [])

    return (
      <div className={styles.modal}>
        <h2>Edit "{this.props.componentStructure.name}" Component </h2>
        <div onClick={this.props.onDelete}>Delete</div>
        <h3>Values:</h3>
        {baseComponentValuesEl}
        {componentValuesEl}
      </div>
    );
  }
}

export default inject(store => ({ baseComponentStore: store.baseComponentStore }))(TreeModal);
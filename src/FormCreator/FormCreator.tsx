import React, { Component, Fragment, ComponentType } from 'react';
import AddNewInput from './AddNewInput';
import FormInput from './FormInput';

import uuid from 'uuid/v4';
import { ComponentStructure, GeneratedComponent, BaseComponent, BaseProperty, ComponentValues } from '../types';

// Types
export type ComponentProperty = {
  allowed?: string[];
  custom?: ComponentStructure[];
}
export type BaseProperty = 'string' | 'boolean' | 'component' | ComponentProperty;
export type ArrayProperty = BaseProperty[];
export type ComponentProperties = {
  [propertyName: string]: BaseProperty// | ArrayProperty;
};

export type ComponentStructure = {
  component: ComponentType<any>;
  name: string;
  propertyTypes: ComponentProperties;
  defaultValues?: ComponentValues;
}

// Values
export type BaseValue = string | boolean;
export type ArrayValue = BaseValue[];
export type ComponentValues = {
  [propertyName: string]: BaseValue | ArrayValue | GeneratedComponent[];
}

export type GeneratedComponent = {
  name: string;
  values: ComponentValues;
}

export interface FormCreatorProps {
  componentTypes: ComponentStructure[];
  componentList: GeneratedComponent[];
  generateDefaultValue: (baseType: BaseProperty) => any;
  onAdd: (index: number, generatedComponent: GeneratedComponent) => any;
  onRemove: (index: number) => any;
  onChange: (index: number, values: ComponentValues) => any;
}

export default class FormCreator extends Component<FormCreatorProps, any> {

  // generateDefaultValues = (structure: ComponentStructure): ComponentValues => {
  //   if (!structure.defaultValues) {
  //     const { propertyTypes } = structure;
  //     return Object.entries(propertyTypes).reduce((prevDefaults, [propertyName, type]) => {
  //       let defaultValue;
  //       if (typeof type === 'object' || type === 'component') {
  //         defaultValue = [];
  //       } else if (type === 'string') {
  //         defaultValue = '';
  //       } else if (type === 'boolean') {
  //         return false
  //       }

  //       return {
  //         ...prevDefaults,
  //         [propertyName]: defaultValue
  //       }
  //     }, {});
  //   }
  //   return structure.defaultValues;
  // }
  generateDefaultValues = async (structure: ComponentStructure): Promise<ComponentValues> => {
    return await Object.entries(structure.propertyTypes).reduce(async (prevDefaults, [propertyName, type]) => {
      let defaultValue;
      if (structure.defaultValues && structure.defaultValues[propertyName] !== undefined) {
        defaultValue = structure.defaultValues[propertyName];
      } else {
        defaultValue = await Promise.resolve(this.props.generateDefaultValue(type));
      }
      return {
        ...(await prevDefaults),
        [propertyName]: defaultValue
      }
    }, Promise.resolve({}));
  }

  handleAdd = (index: number) => async (componentName: string) => {
    const structure = this.props.componentTypes.find(structure => structure.name === componentName);
    if (!structure) {
      throw new Error(`Component ${componentName} was not found!`);
    }
    const defaultValues = await this.generateDefaultValues(structure);
    const newComponent: GeneratedComponent = {
      name: componentName,
      id: uuid(),
      values: defaultValues
    }
    this.props.onAdd(index, newComponent);
  }

  handleRemove = (index: number) => () =>
    this.props.onRemove(index);

  handleChange = (index: number) => (propertyName: string, value: any) => {
    const newValues = {
      ...this.props.componentList[index].values,
      [propertyName]: value
    };
    this.props.onChange(index, newValues);
  }

  getStructure = (componentName: string): ComponentStructure => {
    const structure = this.props.componentTypes.find(info => info.name === componentName);
    if (!structure) {
      throw new Error(`Component ${componentName} not found!`);
    }
    return structure;
  }

  public render() {

    // TODO: NEW LINE for textarea https://stackoverflow.com/questions/36260013/react-display-line-breaks-from-saved-textarea

    const inputs = this.props.componentList.map((info, index) => (
      <Fragment key={info.id}>
        <h1>{info.name}</h1>
        <FormInput
          componentTypes={this.props.componentTypes}
          propertyTypes={this.getStructure(info.name).propertyTypes}
          componentValues={info.values}
          onPropertyChange={this.handleChange(index)}
          generateDefaultValue={this.props.generateDefaultValue}
        />
      </Fragment>
    ))

    return (
      <div>
        <div>
          <AddNewInput componentTypes={this.props.componentTypes} onNewComponent={this.handleAdd(this.props.componentList.length + 1)} />
          {inputs}
        </div>
      </div>
    );
  }
}
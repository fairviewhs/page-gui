import React, { Component, ChangeEvent, Fragment } from 'react';
import FormCreator, { ComponentValues, ComponentProperties, BaseProperty, ComponentStructure, GeneratedComponent } from './FormCreator';

export interface FormInputProps {
  propertyTypes: ComponentProperties;
  componentValues: ComponentValues;
  onPropertyChange: (propertyName: string, value: any) => any;
  generateDefaultValue: (baseType: BaseProperty) => any;
  componentTypes: ComponentStructure[];
}

export default class FormInput extends Component<FormInputProps, any> {

  handleChange = (propertyName: string, type: BaseProperty) => (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: convert to valid type;
    if (type === 'boolean') { // Checkbox
      this.props.onPropertyChange(propertyName, event.target.checked);
    } else { // Text
      this.props.onPropertyChange(propertyName, event.target.value);
    }
  }

  handleComponentAdd = (property: string) => (index: number, component: GeneratedComponent) => {
    const componentList = this.props.componentValues[property] as GeneratedComponent[]; // TODO: type check
    const newValue = [
      ...componentList,
      component // TODO: handle index
    ]
    this.props.onPropertyChange(property, newValue);
  }
  handleComponentChange = (property: string) => (index: number, values: ComponentValues) => {
    const componentList = this.props.componentValues[property] as GeneratedComponent[]; // TODO: type check
    const newValue = componentList.map((component, indx) => indx === index ? { ...component, values } : component);
    this.props.onPropertyChange(property, newValue);
  }
  handleComponentRemove = (property: string) => (index: number) => {
    const componentList = this.props.componentValues[property] as GeneratedComponent[]; // TODO: type check
    const newValue = componentList.filter((_, indx) => indx !== index);
    this.props.onPropertyChange(property, newValue);
  }

  public render() {
    const { propertyTypes, componentValues } = this.props;

    const inputs = Object.entries(propertyTypes)
      .map(([property, type]) => {
        const value = componentValues[property];
        let input;
        if (Array.isArray(type)) {
          return null;
        } else if (type === 'component') {
          input = (
            <FormCreator
              componentTypes={this.props.componentTypes}
              onAdd={this.handleComponentAdd(property)}
              onChange={this.handleComponentChange(property)}
              onRemove={this.handleComponentRemove(property)}
              componentList={value as GeneratedComponent[]} // TODO: type check
              generateDefaultValue={this.props.generateDefaultValue}
            />
          );
        } else if (typeof type === 'object') {
          const { allowed = [], custom = [] } = type;
          let validTypes: ComponentStructure[] = [];
          validTypes = this.props.componentTypes.filter(componentType => allowed.includes(componentType.name));
          validTypes = [...validTypes, ...custom];
          input = (
            <FormCreator
              componentTypes={validTypes}
              onAdd={this.handleComponentAdd(property)}
              onChange={this.handleComponentChange(property)}
              onRemove={this.handleComponentRemove(property)}
              componentList={value as GeneratedComponent[]} // TODO: type check
              generateDefaultValue={this.props.generateDefaultValue}
            />
          );
        } else if (type === 'boolean') {
          input = <input type="checkbox" value={value as string} onChange={this.handleChange(property, type)} />;// TODO: type check
        } else {
          input = <input type="text" value={value as string} onChange={this.handleChange(property, type)} />;// TODO: type check
        }
        return (
          <Fragment>
            <h4>{property}</h4>
            {input}
          </Fragment>
        );
      })

    return (
      <div>
        {inputs}
      </div>
    );
  }
}
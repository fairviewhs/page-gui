import React, { Component } from 'react';
import { ComponentStructure, GeneratedComponent } from './FormCreator';

export interface CompileComponentsProps {
  componentList: GeneratedComponent[];
  componentTypes: ComponentStructure[];
}

export default class CompileComponents extends Component<CompileComponentsProps> {

  public render() {
    console.log(this.props)
    const compiledComponents = this.props.componentList.map(info => {
      const componentInfo = this.props.componentTypes.find(structure => structure.name === info.name);
      if (!componentInfo) {
        throw new Error(`Component ${info.name} was not found!`);
      }
      const values = Object.entries(info.values).reduce((prevOptions, [property, value]) => {
        if (Array.isArray(value)) { // GeneratedComponent[]
          const type = componentInfo.propertyTypes[property];
          let validTypes: ComponentStructure[] = [];
          if (typeof type === 'object' && !Array.isArray(type)) {
            const { allowed = [], custom = [] } = type;
            validTypes = [
              ...this.props.componentTypes.filter(type => allowed.includes(type.name)),
              ...custom
            ];
          } else {
            validTypes = this.props.componentTypes;
          }
          return {
            ...prevOptions,
            [property]: <CompileComponents key={property} componentList={value as GeneratedComponent[]} componentTypes={validTypes} /> // TODO: type check
          }
        }
        return {
          ...prevOptions,
          [property]: value
        }
      }, {})
      return <componentInfo.component key={info.id} {...values}/>
    });

    return compiledComponents;
  }
}
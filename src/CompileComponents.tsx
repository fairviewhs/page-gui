import React, { Component } from 'react';
import { GeneratedComponent, ComponentStructure, BaseComponentName } from './types';
import { observer, inject } from 'mobx-react';
import { BaseComponentStore } from './stores/BaseComponent.store';

export interface CompileComponentsProps {
  baseComponentStore: BaseComponentStore;
  componentList: GeneratedComponent[];
  componentTypes: ComponentStructure[];
}

@observer
class CompileComponents extends Component<CompileComponentsProps> {

  public render() {
    console.log(this.props)
    const compiledComponents = this.props.componentList.map(info => {
      const componentInfo = this.props.componentTypes.find(structure => structure.id === info.componentType);
      if (!componentInfo) {
        throw new Error(`Component type "${info.componentType}" was not found!`);
      }
      const values = Object.entries(info.values).reduce((prevOptions, [property, value]) => {
        const type = componentInfo.propertyTypes[property];
        if (Array.isArray(value)) { // GeneratedComponent[]
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
            [property]: <CompileComponentsWithStore key={property} componentList={value} componentTypes={validTypes} /> // TODO: type check
          }
        }
        // value is a base value name
        // TODO: handle baseproperty === 'component'
        const baseComponent = this.props.baseComponentStore.baseComponents.find(base => base.name === (type as BaseComponentName));
        if (!baseComponent) {
          throw new Error(`BaseComponent "${type}" was not found.`);
        }
        return {
          ...prevOptions,
          [property]: <baseComponent.renderComponent>{value}</baseComponent.renderComponent>
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

const CompileComponentsWithStore = inject(store => ({ baseComponentStore: store.baseComponentStore }))(CompileComponents);

export default CompileComponentsWithStore;
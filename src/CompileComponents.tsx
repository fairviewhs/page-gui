import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { GeneratedComponent } from './GeneratedComponent';
import { Structure } from './types';

export interface CompileComponentsProps {
  onClick: (componentId: string) => any;
  componentList: GeneratedComponent[];
  componentTypes: Structure[];
}

@observer
export default class CompileComponents extends Component<CompileComponentsProps> {

  handleClick = (id: string) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    this.props.onClick(id);
  };

  public render() {
    const compiledComponents = this.props.componentList.map(info => {
      const componentInfo = this.props.componentTypes.find(structure => structure.id === info.componentType);
      if (!componentInfo) {
        throw new Error(`Component type "${info.componentType}" was not found!`);
      }
      const componentListPropValues = Object.entries(info.componentListProps).reduce((prevOptions, [property, value]) => ({
        ...prevOptions,
        [property]: <CompileComponents onClick={this.props.onClick} key={property} componentList={value} componentTypes={info.flattedComponentListProps[property]} /> // TODO: type check
      }), {});

      return (
        <div
          onClick={this.handleClick(info.id)}
        >
          <componentInfo.component key={info.id} {...info.values} {...componentListPropValues} />
        </div>
      );
    });

    return compiledComponents;
  }
}
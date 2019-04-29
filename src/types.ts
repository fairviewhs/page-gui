import { ComponentType } from 'react';
import { has } from 'lodash';

export type ComponentId = string;

export type ComponentProperty = {
  allowed?: string[];
  custom?: ComponentStructure[];
}
export type BaseProperty = BaseComponentName | 'component' | ComponentProperty;
export type ArrayProperty = BaseProperty[];
export type ComponentProperties = {
  [propertyName: string]: BaseProperty// | ArrayProperty;
};

export type ComponentStructureId = string;

export type ComponentStructure = {
  id: ComponentStructureId;
  component: ComponentType<any>;
  name: string;
  propertyTypes: ComponentProperties;
  defaultValues?: ComponentValues;
}

// Values
// export type BaseValue = string | boolean;
// export type ArrayValue = BaseValue[];
export type ComponentValues = {
  [propertyName: string]: any | GeneratedComponent[]; // note that any is the value for the BaseComponents
}

export type GeneratedComponent = {
  componentType: ComponentStructureId;
  id: ComponentId;
  values: ComponentValues;
}

// Base is the final component of the tree
// It includes the paragraph/string input and boolean input
export type BaseComponentName = string;

export interface BaseComponentInputProps<T> {
  onChange: (value: T) => any;
  value: T;
}

export interface BaseComponentRenderProps<T> {
  children: T;
}

export type BaseInputComponent<T> = ComponentType<BaseComponentInputProps<T>>;
export type BaseRenderComponent<T> = ComponentType<BaseComponentRenderProps<T>>;

export type BaseComponent<T> = {
  name: BaseComponentName;
  inputComponent: BaseInputComponent<T>;
  renderComponent: BaseRenderComponent<T>;
  defaultValue?: T;
}

export const isGeneratedComponent = 
  (value: any): value is GeneratedComponent =>
    has(value, 'id') && has(value, 'values');

export const isGeneratedComponentArray = 
  (value: any[]): value is GeneratedComponent[] =>
    value.length > 0 && value.every(val => isGeneratedComponent(val));
import { ComponentType } from 'react';
import { isPlainObject, has } from 'lodash';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type BasicInput<V> = ComponentType<{ onChange: (value: V) => any, value: V }>;

export type BasicInputDefinition<V> = {
  render: BasicInput<V>;
  fromJSON?: (jsonData: any) => V;
  toJSON?: (value: V) => any;
}

export type ComponentListProp<T> = 'any' | { custom?: T[], allowed?: string[] };

export type ComponentListStructureProp = ComponentListProp<Structure>;
export type BasicProp = ComponentType<any> | BasicInputDefinition<any>;

// <CL, BI, CLK extends keyof CL, BIK extends keyof BI> look at mobx-react.d.ts
export type Structure = {
  id: string;
  name: string;
  component: ComponentType<any>; // TODO: any should match with props
  componentListProps: {
    [property: string]: ComponentListStructureProp; // allowed is the list of top level Structure ids
  }
  basicInputProps: {
    [property: string]: BasicProp;
  },
  defaultValues: GuiComponentValues;
}

export type ConfigStructure = Omit<Structure, 'componentListProps' | 'basicInputProps'> & {
  propertyTypes: {
    [property: string]: ComponentListProp<ConfigStructure> | BasicProp;
  }
}

export type GuiComponentValues = {
  [property: string]: any;
}

export type GuiComponent = {
  id: string;
  componentType: string;
  values: GuiComponentValues;
}

export type BasicInputComponent<V> = { onChange: (value: V) => any; value: V };

// Helper Functions

export const isBasicInputDefinition = <T>(value: any): value is BasicInputDefinition<T> =>
  isPlainObject(value) && has(value, 'render');

export const isComponentListProp = <T>(value: any): value is ComponentListProp<T> =>
  value === 'any' || (isPlainObject(value) && (has(value, 'custom') || has(value, 'allowed')));
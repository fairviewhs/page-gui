import { ComponentStructure, ComponentValues, ComponentStructureId } from "../types";
import { observable } from 'mobx';
import baseComponentStore from './BaseComponent.store';
import { isString, get, has, isObject } from 'lodash';
import config from "../config";

export class ComponentStructureStore {
  @observable componentStructures: ComponentStructure[];

  constructor( componentStructures: ComponentStructure[] = []) {
    this.componentStructures = componentStructures;
  }

  findStructureRecursive = (find: (structure: ComponentStructure) => boolean, list: ComponentStructure[] = this.componentStructures): ComponentStructure | null => {
    const surfaceLevel = list.find(structure => find(structure));
    if (!!surfaceLevel) return surfaceLevel;
    return list.reduce((prevFound: null | ComponentStructure, value) => {
      if (!!prevFound) return prevFound;
      return Object.values(value.propertyTypes)
        .reduce((foundValue: ComponentStructure | null, value) => {
          // if value is a string then it is a baseComponent, thus we can't go deeper
          if (!!foundValue || isString(value) || (!isString(value) && !has(value, 'custom'))) return foundValue;
          return this.findStructureRecursive(find, value.custom as ComponentStructure[]);
        }, null);
    }, null);
  }

  getDefaultValue = (id: ComponentStructureId): ComponentValues => {
    const structure = this.findStructureRecursive(structure => structure.id === id);
    if (!structure) throw new TypeError(`Structure was not found for id "${id}"`);
    return Object.entries(structure.propertyTypes).reduce((prevDefaults: ComponentValues, [propertyName, type]) => {
      let defaultValue;

      if (type === 'component' || isObject(type)) { // Type is a component list
        defaultValue = [];
      } else if (isString(type)) { // Type is a base component name
        console.log({type});
        const baseComponent = baseComponentStore.baseComponents.find(base => base.name === type);
        if (!baseComponent) throw new TypeError(`BaseComponent "${type}" was not found in the list.`);
        defaultValue = baseComponent.defaultValue;
      } else if (get(structure, ["defaultValues", propertyName])) {
        defaultValue = get(structure, ["defaultValues", propertyName])
      }

      return {
        ...prevDefaults,
        [propertyName]: defaultValue
      }
    }, {});
  }

  // is flattens the component structure tree down to a list for a specific structure
  flatten = (structure: ComponentStructure): {
    [propertyName: string]: ComponentStructure[]
  } => {
    if (!structure) return {}; // TODO: better error message
    return Object.entries(structure.propertyTypes)
      .reduce((prevList, [ propName, type]) => {
        if (type === 'component') { // Include all components
          return {
            ...prevList,
            [propName]: this.componentStructures
          }
        } else if (typeof type === 'object') { // include allowed and custom
          const { allowed = [], custom = [] } = type;
          const allowedStructures = this.componentStructures.filter(structure => allowed.includes(structure.name)); // TODO: work on for flatten filter because this only works for the surface components
          return {
            ...prevList,
            [propName]: [
              ...allowedStructures,
              ...custom
            ]
          }
        }
        return prevList;
      }, {} as { [propName: string]: ComponentStructure[] });
  }
}

export default new ComponentStructureStore(config.componentStructures);
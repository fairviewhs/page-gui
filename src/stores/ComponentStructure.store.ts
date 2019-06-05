import { observable } from 'mobx';
import config from "../config";
import { Structure, ConfigStructure, isComponentListProp } from '../types';

export class ComponentStructureStore {
  @observable componentStructures: Structure[];

  private static createStructureFromConfig = (configStructure: ConfigStructure): Structure => {
    const { propertyTypes, ...rest } = configStructure;

    const componentListProps = {};
    const basicInputProps = {};
    
    Object.entries(propertyTypes)
      .forEach(([propertyName, type]) => {
        if (isComponentListProp<ConfigStructure>(type)) {
          if (type !== 'any') {
            const { custom = [], allowed = [] } = type;
            const customRecursive = custom.map(customConfigStructure => ComponentStructureStore.createStructureFromConfig(customConfigStructure));
            componentListProps[propertyName] = { allowed, custom: customRecursive };
          } else {
            componentListProps[propertyName] = type;
          }
        } else {
          basicInputProps[propertyName] = type;
        }
      })

    return {
      ...rest,
      componentListProps,
      basicInputProps
    }
  }

  constructor(componentStructures: ConfigStructure[] = []) {
    this.componentStructures = componentStructures.map(configStructure => ComponentStructureStore.createStructureFromConfig(configStructure));
  }

  find = (findFn: (structure: Structure) => boolean, list: Structure[] = this.componentStructures): Structure | null => {
    const surfaceLevel = list.find(structure => findFn(structure));
    if (!!surfaceLevel) return surfaceLevel;
    return list.reduce((prevFound: null | Structure, value) => {
      if (!!prevFound) return prevFound;
      return Object.values(value.componentListProps)
        .reduce((foundValue: Structure | null, value) => {
          return value !== 'any' ? this.find(findFn, value.custom) : null;
        }, null);
    }, null);
  }
}

export default new ComponentStructureStore(config.componentStructures);
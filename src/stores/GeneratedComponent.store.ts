import { GeneratedComponent, isComponentProperty, isGeneratedComponentArray, ComponentValues, ComponentId } from "../types";
import { observable, action } from "mobx";
import componentStructureStore from './ComponentStructure.store';

export class GeneratedComponentStore {
  @observable components: GeneratedComponent[];
  constructor(components: GeneratedComponent[] = []) {
    this.components = components;
  }

  find = (findFn: (component: GeneratedComponent) => boolean, list: GeneratedComponent[] = this.components): GeneratedComponent | null => {
    const surfaceFind = list.find(component => findFn(component));
    if (!!surfaceFind) return surfaceFind;
    return list.reduce((prevFound: null | GeneratedComponent, component: GeneratedComponent) => {
      if (!!prevFound) return prevFound;
      
      return Object.entries(component.values).reduce((prevFoundSub: null | GeneratedComponent, [propertyName, value]) => {
        if (!!prevFoundSub) return prevFoundSub;
        
        const structure = componentStructureStore.findStructureRecursive(structure => structure.id === component.componentType);
        if (!structure) throw new TypeError(`Structure id "${component.componentType}" was not found.`);
        const type = structure.propertyTypes[propertyName];
        // If the component value is a component property list filter recursively
        if (isComponentProperty(type) || type === 'component') {
          return this.find(findFn, value as GeneratedComponent[]);
        }
        return null;
      }, null);
    }, null);
  }

  filter = (filterFn: (component: GeneratedComponent) => boolean, list: GeneratedComponent[] = this.components): GeneratedComponent[] => {
    const surfaceFiltered = list.filter(filterFn);
    return surfaceFiltered.map(component => {
      const filteredValues = Object.entries(component.values).reduce((prevValues: ComponentValues, [propertyName, value]) => {
        const structure = componentStructureStore.findStructureRecursive(structure => structure.id === component.componentType);
        if (!structure) throw new TypeError(`Structure id "${component.componentType}" was not found.`);
        const type = structure.propertyTypes[propertyName];
        // If the component value is a component property list filter recursively
        if (isComponentProperty(type) || type === 'component') {
          return {
            ...prevValues,
            [propertyName]: this.filter(filterFn, value as GeneratedComponent[])
          };
        } else { // Else return the value
          return {
            ...prevValues,
            [propertyName]: value
          };
        }
      }, {} as ComponentValues);
      return {
        ...component,
        values: filteredValues
      }
    });
  }

  map = (mapFn: (component: GeneratedComponent) => GeneratedComponent, list: GeneratedComponent[] = this.components): GeneratedComponent[] => {
    return list.reduce((prevComponents: GeneratedComponent[], component: GeneratedComponent) => {
      const mappedValues = Object.entries(component.values).reduce((prevValues: ComponentValues, [propertyName, value]) => {
        // TODO: fix not using prevValues
        const structure = componentStructureStore.findStructureRecursive(structure => structure.id === component.componentType);
        if (!structure) throw new TypeError(`Structure id "${component.componentType}" was not found.`);
        const type = structure.propertyTypes[propertyName];
        if (isComponentProperty(type) || type === 'component') {
          return {
            ...prevValues,
            [propertyName]: this.map(mapFn, value as GeneratedComponent[])
          }
        }
        return {
          ...prevValues,
          [propertyName]: value
        };
      }, {} as ComponentValues);
      return [
        ...prevComponents,
        mapFn({
          ...component,
          values: mappedValues
        })
      ];
      // Please note that we map the parent after the children
    }, [] as GeneratedComponent[]);
  }

  // TODO: add at position
  @action add = (componentToAdd: GeneratedComponent, parent?: { id: ComponentId, propertyName: string }) => {
    if (!parent) {
      this.components = [
        ...this.components,
        componentToAdd
      ]
    } else {
      this.components = this.map(component => {
        if (component.id === parent.id) { // Append the `component` to the parent[propertyValue] GeneratedComponent[]
          console.log({ component, parent, parentProp: component.values[parent.propertyName],
            spread: {
              ...component,
              values: {
                ...component.values,
                [parent.propertyName]: [
                  ...component.values[parent.propertyName],
                  componentToAdd
                ]
              }
            }
          })
          return {
            ...component,
            values: {
              ...component.values,
              [parent.propertyName]: [
                ...component.values[parent.propertyName],
                componentToAdd
              ]
            }
          }
        }
        return component;
      });
    }
  }
}

export default new GeneratedComponentStore();
import uuid from 'uuid/v4';
import { has } from 'lodash';
import { Structure, BasicInputDefinition } from './types';
import componentStructureStore from './stores/ComponentStructure.store';
import { isPlainObject } from 'lodash';

export class GeneratedComponent {
  public readonly id: string;
  public readonly componentType: string;
  public readonly values: { [property: string]: any };
  // public values: 'all' | { allowed?: string[], custom?: [] };

  isValidValue = (propertyName: string, list: GeneratedComponent[]): boolean => {
    const structureListId = this.flattedComponentListProps[propertyName].map(struct => struct.id);
    return list.every(comp => structureListId.includes(comp.componentType));
  }

  // TODO: test
  isValidValues = (values: { [prop: string]: any }): boolean => {
    const { structure } = this;
    // TODO: check all values exists
    // TODO: check recursivly that componentListProps are valid
    return !Object.entries(this.componentListProps)
      .some(([propertyName, structureList]) => {
        const components = values[propertyName] as GeneratedComponent[];
        return components.some(component => structureList.findIndex(structure => structure.id === component.componentType) === -1) // return true is there is a component with componentType that is not in the allowed components for property
        // if (value.some()) {
        //   return true;
        // }
        // return false;
      }); // return false if there are some invalid properties
  } 

  constructor({ id = uuid(), componentType, values }: { id?: string, componentType: string, values?: { [property: string]: any } }) {
    this.id = id;
    this.componentType = componentType;
    if (values === undefined) {
      this.values = this.structure.defaultValues;
    } else {
      if (!this.isValidValues) {
        throw new TypeError(`Invalid values for component ${componentType}`);
      }
      this.values = values;
    }
  }

  get structure(): Structure {
    const structure = componentStructureStore.find(structure => structure.id === this.componentType);
    if (!structure) throw new TypeError(`Component with componentType "${this.componentType}" was not found in structures`);
    return structure;
  }

  get componentListProps(): { [property: string]: GeneratedComponent[] } {
    const propertiesWithList = Object.keys(this.structure.componentListProps);
    return Object.entries(this.values)
      .filter(([propertyName, value]) => propertiesWithList.includes(propertyName))
      .reduce((prev, [propertyName, value]) => ({
        ...prev,
        [propertyName]: value
      }), {});
  }

  get flattedComponentListProps(): { [property: string]: Structure[] } {
    return Object.entries(this.structure.componentListProps).reduce((prev, [propertyName, definition]) => {
      if (definition === 'any') {
        return {
          ...prev,
          [propertyName]: componentStructureStore.componentStructures
        }
      }
      const { custom = [], allowed = [] } = definition;
      const allowedGlobal = componentStructureStore.componentStructures.filter(component => allowed.includes(component.id));
      return {
        ...prev,
        [propertyName]: [...allowedGlobal, ...custom]
      }
    }, {});
  }

  get asJSON() {
    const { id, componentType, values } = this;
    // TODO: toJSON for basic inputs
    return {
      id,
      componentType,
      values
    }
  }

  public static fromJSON(json: any): GeneratedComponent | null {
    if (
      has(json, 'id') &&
      has(json, 'componentType') &&
      has(json, 'values')
    ) {
      const structure = componentStructureStore.find(structure => structure.id === json.componentType);
      if (!structure) throw TypeError(`Failed to parse json for Component with unknown componentType "${json.componentType}"`);
      
      const subComponentListValues = Object.entries(json.values)
        .filter(([propertyName, value]) => Object.keys(structure.componentListProps).includes(propertyName))
        .reduce((prev, [propertyName, value]) => {
          if (!Array.isArray(value)) {
            // acoording to strucuture value should be a Component[] but it is not.
            throw new TypeError();
          }
          return {
            ...prev,
            [propertyName]: value.map(subValue => GeneratedComponent.fromJSON(subValue))
          };
        }, {});

      const basicInputValues = Object.entries(json.values)
        .filter(([propertyName, value]) => Object.keys(structure.basicInputProps).includes(propertyName))
        .reduce((prev, [propertyName, value]: [string, any]) => {
          const basicInputDefintion = structure.basicInputProps[propertyName];
          const fromJSON = isPlainObject(basicInputDefintion) && has(basicInputDefintion, 'fromJSON') ? (basicInputDefintion as BasicInputDefinition<any>).fromJSON! : (value) => value;
          return {
            ...prev,
            [propertyName]: fromJSON(value)
          }
        }, {});
      
      return new GeneratedComponent({
        id: json.id,
        componentType: json.componentType,
        values: {
          ...json.values,
          ...basicInputValues,
          ...subComponentListValues
        }
      });
    }
    throw new TypeError('Invalid json for a component.');
  }
}
import uuid from 'uuid/v4';
import { has } from 'lodash';
import { Structure, BasicInputDefinition } from './types';
import componentStructureStore from './stores/ComponentStructure.store';
import { isPlainObject } from 'lodash';

export class GeneratedComponent {
  public readonly id: string;
  public readonly componentType: string;
  public readonly basicInputProps: { [property: string]: any };
  public readonly componentListProps: { [property: string]: GeneratedComponent[] };

  get values(): { [property: string]: any } {
    const { basicInputProps, componentListProps } = this;
    return {
      ...basicInputProps,
      ...componentListProps
    }
  }

  isValidValue = (propertyName: string, list: GeneratedComponent[]): boolean => {
    const structureListId = this.flattenComponentListStructures[propertyName].map(struct => struct.id);
    return list.every(comp => structureListId.includes(comp.componentType));
  }

  // TODO: test
  areValidValues = ({ basicInputProps, componentListProps }: { basicInputProps: { [property: string]: any }, componentListProps: { [property: string]: GeneratedComponent[] } }): boolean => {
    const { structure } = this;
    const allBasicInputsHaveValues = Object.keys(structure.basicInputProps).every(key => key in basicInputProps);
    if (!allBasicInputsHaveValues) {
      return false;
    }
    return !Object.entries(this.flattenComponentListStructures)
      .some(([propertyName, structureList]) => {
        const components = componentListProps[propertyName];
        return components.some(component => structureList.findIndex(structure => structure.id === component.componentType) === -1) // return true is there is a component with componentType that is not in the allowed components for property
      }); // returns false if there are some invalid properties
  }

  private static objectFilter = <T, K extends keyof T>(object: T, pred: (propertyName: K, value: T[K]) => boolean): T => 
    Object.entries(object)
      .filter(([property, value]) => pred(property as K, value))
      .reduce((prev, [property, value]) => ({ ...prev, [property]: value }), {} as T);

  constructor({ id = uuid(), componentType, basicInputProps, componentListProps, values }: { id?: string, componentType: string, basicInputProps?: { [property: string]: any }, componentListProps?: { [property: string]: GeneratedComponent[] }, values?: { [property: string]: any } }) {
    this.id = id;
    this.componentType = componentType;

    const { structure } = this;
    const { defaultValues } = structure;

    if (values !== undefined) {
      this.basicInputProps = GeneratedComponent.objectFilter(values, (key, value) => key in structure.basicInputProps);
      this.componentListProps = GeneratedComponent.objectFilter(values, (key, value) => key in structure.componentListProps);
    } else {
      if (basicInputProps === undefined) {
        // Get defaults valus for basicInputsProps from structure's defaultValues
        this.basicInputProps = GeneratedComponent.objectFilter(defaultValues, (key, value) => key in structure.basicInputProps);
      } else {
        this.basicInputProps = basicInputProps;
      }
  
      if (componentListProps === undefined) {
        // Get defaults valus for componentListProps from structure's defaultValues
        this.componentListProps = GeneratedComponent.objectFilter(defaultValues, (key, value) => key in structure.componentListProps);
      } else {
        this.componentListProps = componentListProps;
      }
    }

    if (!this.areValidValues({ componentListProps: this.componentListProps, basicInputProps: this.basicInputProps })) {
      throw new TypeError(`Invalid property values provided for component "${componentType}"`)
    }
  }

  get structure(): Structure {
    const structure = componentStructureStore.find(structure => structure.id === this.componentType);
    if (!structure) throw new TypeError(`Component with componentType "${this.componentType}" was not found in structures`);
    return structure;
  }

  get flattenComponentListStructures(): { [property: string]: Structure[] } {
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
    const { id, componentType, componentListProps, basicInputProps } = this;
    const { structure } = this;

    const componentListPropsRecursive = Object.entries(componentListProps).reduce((prev, [key, list]) => ({
      ...prev,
      [key]: list.map(component => component.asJSON)
    }), {});

    const basicInputPropsToJSON = Object.entries(basicInputProps).reduce((prev, [key, value]) => {
      const type = structure.basicInputProps[key];
      if (isBasicInputDefinition(type) && type.toJSON !== undefined) {
        return {
          ...prev,
          [key]: type.toJSON(value)
        }
      }
      return {
        ...prev,
        [key]: value
      };
    }, {})

    return {
      id,
      componentType,
      componentListProps: componentListPropsRecursive,
      basicInputProps: basicInputPropsToJSON
    }
  }

  public static fromJSON(json: any): GeneratedComponent | null {
    if (
      has(json, 'id') &&
      has(json, 'componentType') &&
      has(json, 'componentListProps') &&
      has(json, 'basicInputProps')
    ) {
      const structure = componentStructureStore.find(structure => structure.id === json.componentType);
      if (!structure) throw TypeError(`Failed to parse json for Component with unknown componentType "${json.componentType}"`);
      
      const subComponentListValues = Object.entries(json.componentListProps)
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

      const basicInputValues = Object.entries(json.basicInputProps)
        .reduce((prev, [propertyName, value]: [string, any]) => {
          const type = structure.basicInputProps[propertyName];
          if (isBasicInputDefinition(type) && type.fromJSON !== undefined) {
            return {
              ...prev,
              [propertyName] : type.fromJSON(value)
            }
          }
          return {
            ...prev,
            [propertyName]: value
          }
        }, {});
      
      return new GeneratedComponent({
        id: json.id,
        componentType: json.componentType,
        componentListProps: subComponentListValues,
        basicInputProps: basicInputValues
      });
    }
    throw new TypeError('Invalid json for a component.');
  }
}
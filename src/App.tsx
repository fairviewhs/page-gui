import React, { Component, Fragment } from 'react';

import './_global.scss';
import './_templates.scss';
import './responsive.scss';
import 'draft-js/dist/Draft.css';


import CompileComponents from './CompileComponents';

import { isString, has } from 'lodash';
import uuid from 'uuid/v4';

import { renderToString } from 'react-dom/server';
import TreeView from './TreeView/TreeView';
import TreeModal from './TreeView/TreeModal';
import { isArray } from 'util';
import TreeAddChild from './TreeView/TreeAddChild';

import { ComponentStructure, BaseComponent, GeneratedComponent, ComponentId, ComponentValues, isGeneratedComponentArray, BaseProperty } from './types';

export type AppProps = {
  baseComponents: BaseComponent<any>[];
  componentStructures: ComponentStructure[];
  generateDefaultValue: (type: BaseProperty) => any;
}

export type AppState = { 
  componentList: GeneratedComponent[];
  selectedId: ComponentId;
  htmlOutput: string;
};

class App extends Component<AppProps, AppState> {

  state: AppState = {
    componentList: [],
    selectedId: '',
    htmlOutput: ''
  }

  // HTML LOGIC

  generateHtml = () => {
    const renderedComponents = this.state.componentList.map(info => {
      const componentInfo = this.props.componentStructures.find(structure => structure.name === info.name);
      if (!componentInfo) {
        throw new Error(`Component ${info.name} was not found!`);
      }
      return <componentInfo.component {...info.values}/>
    });
    this.setState({ htmlOutput: renderToString(<div>{renderedComponents}</div>) })
  }

  // HELPER LOGIC

  generateDefaultValues = async (structure: ComponentStructure): Promise<ComponentValues> => {
    return await Object.entries(structure.propertyTypes).reduce(async (prevDefaults, [propertyName, type]) => {
      let defaultValue;
      // if type is a basecomponent name
      if (isString(type)) {
        const baseComponent = this.props.baseComponents.find(base => base.name === type);
        if (!baseComponent) throw new Error(`BaseComponent "${type}" was not found.`);
        defaultValue = baseComponent.defaultValue;
        console.log({
          defaultValue,
          propertyName,
          type
        })
      } else if (structure.defaultValues && structure.defaultValues[propertyName] !== undefined) {
        defaultValue = structure.defaultValues[propertyName];
      } else { // TODO: FIX
        defaultValue = await Promise.resolve(this.props.generateDefaultValue(type));
      }
      return {
        ...(await prevDefaults),
        [propertyName]: defaultValue
      }
    }, Promise.resolve({}));
  }

  // FORM LOGIC

  handleAdd = async (newComponentName: string, propName?: string) => {

    console.log({
      newComponentName,
      propName
    })
    
    const structure = this.findComponentStructure(this.props.componentStructures, value => value.name === newComponentName);
    if (!structure) return;
    const newGeneratedComponent = {
      name: newComponentName,
      id: uuid(),
      values: await this.generateDefaultValues(structure)
    } as GeneratedComponent;
    this.setState(prevState => {
      if (prevState.selectedId && !!propName) {
        const parentComponent = this.findGeneratedComponent(prevState.componentList, component => component.id == prevState.selectedId);
        if (!parentComponent) {
          throw Error(`Parent component not found.`);
        }
        const valueComponentList = [
          ...parentComponent.values[propName] as GeneratedComponent[],
          newGeneratedComponent
        ]
        return {
          componentList: this.changeSelectedGeneratedComponentValue(prevState.componentList, prevState.selectedId, propName, valueComponentList)
        }
      }

      return {
        componentList: [
          ...prevState.componentList,
          newGeneratedComponent
        ]
      }
    });
  }

  findComponentStructure = (values: ComponentStructure[], find: (value: ComponentStructure) => boolean): ComponentStructure | null => {
    const surface = values.find(value => find(value));
    if (!!surface) return surface;
    return values.reduce((prevFound: null | ComponentStructure, value) => {
      if (!!prevFound) return prevFound;
      return Object.values(value.propertyTypes)
        .reduce((foundValue: ComponentStructure | null, value) => {
          // if value is a string then it is a baseComponent, thus we can't go deeper
          if (!!foundValue || isString(value) || (!isString(value) && !has(value, 'custom'))) return foundValue;
          return this.findComponentStructure(value.custom as ComponentStructure[], find);
        }, null);
    }, null);
  }

  findGeneratedComponent = (values: GeneratedComponent[], find: (value: GeneratedComponent) => boolean): GeneratedComponent | null => {
    const surface = values.find(value => find(value));
    if (!!surface) return surface;
    return values.reduce((prevFound: null | GeneratedComponent, value) => {
      if (!!prevFound) return prevFound;
      return Object.values(value.values)
        .reduce((foundValue: GeneratedComponent | null, value) => {
          if (!!foundValue) return foundValue;
          if (isArray(value) && isGeneratedComponentArray(value)) {
            return this.findGeneratedComponent(value, find);
          }
          return null;
        }, null);
    }, null);
  }

  deleteGeneratedComponentRecursive = (values: GeneratedComponent[], deleteVal: (value: GeneratedComponent) => boolean): GeneratedComponent[] => {
    return values.reduce((prev: GeneratedComponent[], value: GeneratedComponent) => {
      if (deleteVal(value)) {
        return prev;
      }

      const filteredValues = Object.entries(value.values).reduce((prevVals, [ propName, subValue ]) => {
        let newValue = subValue;
        
        // If subValue is a GeneratedComponent[] call deleteGeneratedComponentRecursive on it
        if (Array.isArray(subValue) && isGeneratedComponentArray(subValue)) {
          newValue = this.deleteGeneratedComponentRecursive(subValue, deleteVal);
        }

        return {
          ...prevVals,
          [propName]: newValue
        }
      }, {} as ComponentValues)

      return [
        ...prev,
        {
          ...value,
          values: filteredValues
        }
      ];
    }, [] as GeneratedComponent[]);
  }
  
  handleSelect = (id: ComponentId) => {
    this.setState({
      selectedId: id
    });
  }

  handleDelete = () =>
    this.setState(prevState => ({
      componentList: this.deleteGeneratedComponentRecursive(prevState.componentList, (value) => value.id === prevState.selectedId),
      selectedId: ''
    }))

  handleRemove = (index: number) => {
    console.log(`Remove Index: ${index}`);
    this.setState({
      componentList: this.state.componentList.filter((component, ind) => ind !== index)
    });
  }

  changeSelectedGeneratedComponentValue = (components: GeneratedComponent[], selectedId: ComponentId, propName: string, newValue: any | GeneratedComponent[]): GeneratedComponent[] => {
    return components.map(component => {
      if (component.id === selectedId) {
        return {
          ...component,
          values: {
            ...component.values,
            [propName]: newValue
          }
        };
      }

      const modifiedValues = Object.entries(component.values)
        .reduce((prevProps, [ propName, value ]) => {
          let modifiedValue = value;
          if (Array.isArray(value) && isGeneratedComponentArray(value)) {
            modifiedValue = this.changeSelectedGeneratedComponentValue(value, selectedId, propName, newValue);
          }
          return {
            ...prevProps,
            [propName]: modifiedValue
          }
        }, {});
      
      return {
        ...component,
        values: modifiedValues
      }
    })
  }

  handleChange = (propName: string, value: any) => {
    this.setState(prevState => ({
      componentList: this.changeSelectedGeneratedComponentValue(prevState.componentList, prevState.selectedId, propName, value)
    }));
  }

  getComponentStructuresForSelected = (): {
    [propName: string]: ComponentStructure[]
  } => {
    const selectedComponent = this.findGeneratedComponent(this.state.componentList, component => component.id === this.state.selectedId);
    if (!selectedComponent) return {}; // TODO: better error message
    const selectedComponentStructure = this.findComponentStructure(this.props.componentStructures, componentStructure => componentStructure.name === selectedComponent.name);
    if (!selectedComponentStructure) return {}; // TODO: better error message
    return Object.entries(selectedComponentStructure.propertyTypes)
      .reduce((prevList, [ propName, type]) => {
        if (type === 'component') { // Include all components
          return {
            ...prevList,
            [propName]: this.props.componentStructures
          }
        } else if (typeof type === 'object') { // include allowed and custom
          const { allowed = [], custom = [] } = type;
          const allowedStructures = this.props.componentStructures.filter(structure => allowed.includes(structure.name));
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

  render() {

    const htmlOut = !!this.state.htmlOutput ?
      <Fragment>
        <h2>HTML Output</h2>
        {this.state.htmlOutput}
      </Fragment>
      :
      null;

    const selectedGeneratedComponent = this.findGeneratedComponent(this.state.componentList, (value) => value.id === this.state.selectedId);
    const selectedComponentStructure = selectedGeneratedComponent !== null ? this.findComponentStructure(this.props.componentStructures, (value) => value.name === selectedGeneratedComponent.name) : null;
    const selectedChildComponentStructures = !!this.state.selectedId ? this.getComponentStructuresForSelected() : null;

    return (
      <div style={{ display: 'flex', backgroundColor: '#ddd', minHeight: '100vh' }}>
        <div style={{ margin: 'auto', width: '80%', zIndex: 10 }}>
          <CompileComponents
            componentList={this.state.componentList}
            componentTypes={this.props.componentStructures}
            baseComponents={this.props.baseComponents}
          />
          <TreeView 
            selectedId={this.state.selectedId}
            onSelect={this.handleSelect}
            componentList={this.state.componentList}
            componentTypes={this.props.componentStructures}
          />
          {
            !!selectedGeneratedComponent && !!selectedComponentStructure && !!selectedChildComponentStructures &&
            <TreeModal
              onAddComponent={this.handleAdd}
              onChange={this.handleChange}
              onDelete={this.handleDelete}
              baseComponents={this.props.baseComponents}
              component={selectedGeneratedComponent}
              componentStructure={selectedComponentStructure}
              childComponentStructures={selectedChildComponentStructures}
            />
          }
          <TreeAddChild
            onAddComponent={this.handleAdd}
            componentStructures={this.props.componentStructures}
          />
          <button onClick={this.generateHtml}>Generate HTML</button>
          {htmlOut}
        </div>
      </div>
    );
  }
}

export default App;

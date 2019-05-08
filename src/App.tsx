import React, { Component, Fragment, ChangeEvent } from 'react';

import './_global.scss';
import './_templates.scss';
import './responsive.scss';
import 'draft-js/dist/Draft.css';

import CompileComponents from './CompileComponents';

import uuid from 'uuid/v4';

import { renderToString } from 'react-dom/server';
import TreeView from './TreeView/TreeView';
import TreeModal from './TreeView/TreeModal';
import { isNumber } from 'lodash';
import TreeAddChild from './TreeView/TreeAddChild';

// Stores
import { GeneratedComponentStore } from './stores/GeneratedComponent.store';
import { ComponentStructureStore } from './stores/ComponentStructure.store';
import { inject, observer } from 'mobx-react';

import { GeneratedComponent, ComponentId } from './types';

export type AppProps = {
  componentStructureStore: ComponentStructureStore;
  generatedComponentStore: GeneratedComponentStore;
}

export type AppState = {
  selectedId: ComponentId;
  htmlOutput: string;
  id: string;
};

@observer
class App extends Component<AppProps, AppState> {

  state: AppState = {
    selectedId: '',
    htmlOutput: '',
    id: ''
  }

  generateHtml = () => {
    const renderedComponents = this.props.generatedComponentStore.components.map(info => {
      const componentInfo = this.props.componentStructureStore.findStructureRecursive(structure => structure.id === info.componentType);
      if (!componentInfo) {
        throw new Error(`Component type "${info.componentType}" was not found!`);
      }
      return <componentInfo.component {...info.values}/>
    });
    this.setState({ htmlOutput: renderToString(<div>{renderedComponents}</div>) })
  }

  handleAdd = (componentStructureId: string, propName?: string) => {
    const structure = this.props.componentStructureStore.findStructureRecursive(structure => structure.id === componentStructureId);
    if (!structure) return;
    const newGeneratedComponent = {
      componentType: structure.id,
      id: uuid(),
      values: this.props.componentStructureStore.getDefaultValue(structure.id)
    } as GeneratedComponent;
    const parentDetails = !propName ? undefined : { id: this.state.selectedId, propertyName: propName };
    this.props.generatedComponentStore.add(newGeneratedComponent, parentDetails);
  }

  handleSelect = (id: ComponentId) => {
    this.setState({
      selectedId: id
    });
  }

  handleDelete = () => {
    this.props.generatedComponentStore.components = this.props.generatedComponentStore.filter(component => component.id !== this.state.selectedId);
    this.setState({ selectedId: '' });
  }

  handleChange = (propName: string, value: any) => {
    this.props.generatedComponentStore.components = this.props.generatedComponentStore.map(component => {
      if (component.id === this.state.selectedId) {
        return {
          ...component,
          values: {
            ...component.values,
            [propName]: value
          }
        }
      }
      return component;
    })
  }

  change = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNumber(event.target.value)) {
      this.setState({ id: event.target.value });
    }
  }

  render() {
    const htmlOut = !!this.state.htmlOutput ?
      <Fragment>
        <h2>HTML Output</h2>
        {this.state.htmlOutput}
      </Fragment>
      :
      null;

    const selectedGeneratedComponent = this.props.generatedComponentStore.find(component => component.id === this.state.selectedId);
    const selectedComponentStructure = selectedGeneratedComponent !== null ? this.props.componentStructureStore.findStructureRecursive(structure => structure.id === selectedGeneratedComponent.componentType) : null;
    const selectedChildComponentStructures = !!this.state.selectedId && !!selectedComponentStructure ? this.props.componentStructureStore.flatten(selectedComponentStructure) : null;

    return (
      <div id="main-wrapper">
        <div className="tree-view">
          <h2> Tree View: </h2>
          <TreeView
            selectedId={this.state.selectedId}
            onSelect={this.handleSelect}
            componentList={this.props.generatedComponentStore.components}
            componentTypes={this.props.componentStructureStore.componentStructures}
          />
          <div>
          <TreeAddChild
            onAddComponent={this.handleAdd}
            componentStructures={this.props.componentStructureStore.componentStructures}
          />
          <button onClick={this.generateHtml}>Generate HTML</button>
        </div>
        </div>
        <div id="component-wrapper">
          <CompileComponents
            onClick={this.handleSelect}
            componentList={this.props.generatedComponentStore.components}
            componentTypes={this.props.componentStructureStore.componentStructures}
          />
        </div>
        <div id="modal">
          {
            !!selectedGeneratedComponent && !!selectedComponentStructure && !!selectedChildComponentStructures &&
            <TreeModal
              onAddComponent={this.handleAdd}
              onChange={this.handleChange}
              onDelete={this.handleDelete}
              component={selectedGeneratedComponent}
              componentStructure={selectedComponentStructure}
              childComponentStructures={selectedChildComponentStructures}
            />
          }
        </div>
        {htmlOut}
      </div>
    );
  }
}

export default inject(store => ({ componentStructureStore: store.componentStructureStore, generatedComponentStore: store.generatedComponentStore }))(App);

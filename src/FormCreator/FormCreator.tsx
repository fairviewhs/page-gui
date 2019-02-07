import React, { Component, FormEvent, Fragment, ComponentType } from 'react';
import AddNewInput from './AddNewInput';
import FormInput from './FormInput';
// import FormInput, { FormInputProps } from './FormInput';
// import { renderToString } from 'react-dom/server';

// Types
export type BaseProperty = 'string' | 'boolean';
export type ArrayProperty = BaseProperty[];
export type ComponentProperties = {
  [propertyName: string]: BaseProperty | ArrayProperty;
};

// Values
export type BaseValue = string | boolean;
export type ArrayValue = BaseValue[];
export type ComponentValues = {
  [propertyName: string]: BaseValue | ArrayValue;
}

export type ComponentStructure = {
  component: ComponentType<any>;
  name: string;
  propertyTypes: ComponentProperties;
  defaultValues: ComponentValues;
}

export type GeneratedComponent = {
  name: string;
  values: ComponentValues;
}

export interface FormCreatorProps {
  componentTypes: ComponentStructure[];
  componentList: GeneratedComponent[];
  onAdd: (index: number, generatedComponent: GeneratedComponent) => any;
  onRemove: (index: number) => any;
  onChange: (index: number, values: ComponentValues) => any;
}

export default class FormCreator extends Component<FormCreatorProps, any> {
  
  // handleSubmit = (event: FormEvent) => {
  //   event.preventDefault();
  // }

  handleAdd = (index: number) => (componentName: string) => {
    const structure = this.props.componentTypes.find(structure => structure.name === componentName);
    if (!structure) {
      throw new Error(`Component ${componentName} was not found!`);
    }
    const newComponent: GeneratedComponent = {
      name: componentName,
      values: structure.defaultValues
    }
    this.props.onAdd(index, newComponent);
  }

  handleRemove = (index: number) => () =>
    this.props.onRemove(index);

  handleChange = (index: number) => (propertyName: string, value: any) => {
    const newValues = {
      ...this.props.componentList[index].values,
      [propertyName]: value
    };
    this.props.onChange(index, newValues);
  }
  
  // handleSave = () => {
  //   this.props.onSave(this.state.inputs);
  // }

  // genHtml = (inputs: any) => () => {
  //   console.log(renderToString(<Fragment>{inputs}</Fragment>))
  // }

  getStructure = (componentName: string): ComponentStructure => {
    const structure = this.props.componentTypes.find(info => info.name === componentName);
    if (!structure) {
      throw new Error(`Component ${componentName} not found!`);
    }
    return structure;
  }

  public render() {

    // TODO: NEW LINE for textarea https://stackoverflow.com/questions/36260013/react-display-line-breaks-from-saved-textarea

    const renderedComponents = this.props.componentList.map(info => {
      const componentInfo = this.props.componentTypes.find(structure => structure.name === info.name);
      if (!componentInfo) {
        throw new Error(`Component ${info.name} was not found!`);
      }
      return <componentInfo.component {...info.values}/>
    });

    const inputs = this.props.componentList.map((info, index) => (
      <Fragment>
        <h1>{info.name}</h1>
        <FormInput
          propertyTypes={this.getStructure(info.name).propertyTypes}
          componentValues={info.values}
          onPropertyChange={this.handleChange(index)}
        />
      </Fragment>
    ))

    // const componentInfo = this.props.mapping.map(info => {
    //   return {
    //     component: info.component,
    //     name: info.name
    //   }
    // });

    // const inputsInfo = this.state.inputs.map((mapping, index) => (
    //   <>
    //     <FormInput {...mapping} onPropertyChange={this.changePropertyValue(index)} />
    //     {Object.entries(mapping.values).map(([p, v]) => (
    //       <p>{p} {v}</p>
    //     ))}
    //   </>
    // ));

    // const inputs = this.state.inputs.map(mapping => (
    //   <mapping.component {...mapping.values} />
    // ));

    return (
      <div>
        <div>
          {/* {inputsInfo} */}
          <AddNewInput componentTypes={this.props.componentTypes} onNewComponent={this.handleAdd(this.props.componentList.length + 1)} />
          {/* <button onClick={this.handleSave}>Save Info</button> */}
          {/* <button onClick={this.genHtml(inputs)}>Generate HTML</button> */}
          {inputs}
        </div>
        {renderedComponents}
      </div>
    );
  }
}
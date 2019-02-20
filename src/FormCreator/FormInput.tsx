// import React, { Component, Fragment, ChangeEvent } from 'react';
// import ArrayInput from './FormInputTypes/ArrayInput';

// export type FormInputProps = ComponentMapping & {
//   values: {
//     [propertyName: string]: boolean | string
//   },
//   onPropertyChange: (propertyName: string, value: any) => any;
// }

// export default class FormInput extends Component<FormInputProps, any> {

//   handleChange = (propertyName: string) => (event: ChangeEvent<HTMLInputElement> | any) => {
//     console.log(event.target.value);
//     this.props.onPropertyChange(propertyName, event.target.value);
//   }

//   public render() {
//     // TODO: component is not required!
//     const { name, component: Component, properties, values } = this.props;

//     const inputs = Object.entries(properties).map(([property, type]) => {
//       if (Array.isArray(type)) {
//         return <ArrayInput values={[]} onChange={() => {}} properties={type} />
//       }
//       return (
//         <Fragment>
//           <label>{property}</label>
//           <textarea onChange={this.handleChange(property)} value={values[property] as string} />
//         </Fragment>
//       );
//     });

//     return (
//       <div>
//         <h1>{name}</h1>
//         {inputs}
//       </div>
//     );
//   }
// }


import React, { Component, ChangeEvent, Fragment } from 'react';
import { ComponentValues, ComponentProperties, BaseProperty } from './FormCreator';

export interface FormInputProps {
  propertyTypes: ComponentProperties;
  componentValues: ComponentValues;
  onPropertyChange: (propertyName: string, value: any) => any;
  generateDefaultValue: (baseType: BaseProperty) => any;
  componentTypes: ComponentStructure[];
}

export default class FormInput extends Component<FormInputProps, any> {

  handleChange = (propertyName: string, type: BaseProperty) => (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: convert to valid type;
    if (type === 'boolean') { // Checkbox
      this.props.onPropertyChange(propertyName, event.target.checked);
    } else { // Text
      this.props.onPropertyChange(propertyName, event.target.value);
    }
  }

  public render() {
    const { propertyTypes, componentValues } = this.props;

    const inputs = Object.entries(propertyTypes)
      .map(([property, type]) => {
        const value = componentValues[property] as string;
        let input;
        if (Array.isArray(type)) {
          return null;
        } else if (type === 'boolean') {
          input = <input type="checkbox" value={value} onChange={this.handleChange(property, type)} />;
        } else {
          input = <input type="text" value={value} onChange={this.handleChange(property, type)} />
        }
        return (
          <Fragment>
            <h4>{property}</h4>
            {input}
          </Fragment>
        );
      })

    return (
      <div>
        {inputs}
      </div>
    );
  }
}
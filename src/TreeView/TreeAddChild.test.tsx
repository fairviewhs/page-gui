import React, { Component, Fragment } from 'react';
import { mount } from 'enzyme';
import TreeAddChild from './TreeAddChild';
import { ComponentStructure } from '../types';

class ExampleComponent extends Component {
  render() {
    return <Fragment>Hello</Fragment>;
  }
}

describe('TreeAddChild', () => {
  let addComponent, componentStructures, submitEvent;
  beforeEach(() => {
    addComponent = jest.fn();
    componentStructures = [
      {
        component: ExampleComponent,
        name: 'First',
        propertyTypes: {}
      },
      {
        component: ExampleComponent,
        name: 'Second',
        propertyTypes: {}
      }
    ] as ComponentStructure[];
    submitEvent = {
      preventDefault: jest.fn()
    }
  });
it('defaults to the first structure value', () => {
    // Please note that refs only work with mount https://github.com/airbnb/enzyme/issues/1394
    const wrapper = mount(<TreeAddChild onAddComponent={addComponent} componentStructures={componentStructures} />);
    wrapper.find('form').first().simulate('submit', submitEvent);
    expect(addComponent).toBeCalledWith('First');
  });
  it('displays a list of components', () => {
    const wrapper = mount(<TreeAddChild onAddComponent={addComponent} componentStructures={componentStructures} />);
    expect(wrapper.find('select').first()).toMatchSnapshot();
  });
  it('calls onAddComponent when component is submitted', () => {
    const wrapper = mount(<TreeAddChild onAddComponent={addComponent} componentStructures={componentStructures} />);
    // Select the second option
    wrapper.find('select').first().simulate('change', { target: { value: 'Second' } });
    // Submit
    wrapper.find('form').first().simulate('submit', submitEvent);
    expect(submitEvent.preventDefault).toBeCalled();
    expect(addComponent).toBeCalledWith('Second');
  });
});
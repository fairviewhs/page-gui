import React, { Component, Fragment } from 'react';
import { mount } from 'enzyme';
import Select from 'react-select';
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
  it('defaults to nothing', () => {

  });
  it('displays a list of components', () => {
    const wrapper = mount(<TreeAddChild onAddComponent={addComponent} componentStructures={componentStructures} />);
    expect(wrapper.find(Select).first().props().options).toMatchSnapshot();
  });
  describe('when Add button is clicked', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(<TreeAddChild onAddComponent={addComponent} componentStructures={componentStructures} />);
      // Select the second option
      wrapper.find(Select).first().props().onChange({ value: 'Second', label: 'Second' });
      // Click
      wrapper.find('button').last().simulate('click');
    });
    it('calls onAddComponent', () => {
      expect(addComponent).toBeCalledWith('Second');
    });
    it('remove selected component value', () => {
      expect(wrapper.find(Select).last().props().value).toBe(null);
    })
  })
});
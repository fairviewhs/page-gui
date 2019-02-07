import React, { Component } from 'react';

export interface PageSelectProps {
  pages: string[];
}

export default class PageSelect extends Component<PageSelectProps, any> {
  public render() {
    return (
      <form>
        {/* <select 
          defaultValue={defaultValue}
          value={this.props.selectedPage}
          onChange={this.handleChange}
        >
          {options}
        </select> */}
      </form>
    );
  }
}
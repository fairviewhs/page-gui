import React, { Component } from 'react';
import { EditorState, Editor } from 'draft-js';
import { BaseComponentRenderProps } from '../types';

export default class Paragraph extends Component<BaseComponentRenderProps<EditorState>, any> {
  public render() {
    return (
      <div>
        <Editor readOnly editorState={this.props.children} onChange={() => {}} />
      </div>
    );
  }
}
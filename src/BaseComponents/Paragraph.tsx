import React, { Component } from 'react';
import { EditorState, Editor } from 'draft-js-plugins-editor';

export default class Paragraph extends Component<{value: EditorState}, any> {
  public render() {
    return (
      <div>
        <Editor readOnly editorState={this.props.value} onChange={() => {}} />
      </div>
    );
  }
}
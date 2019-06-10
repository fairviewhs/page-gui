import React, { Component } from 'react';
import { EditorState, Editor } from 'draft-js';

export interface TextProps{
  text: EditorState;
}

export default class Text extends Component<TextProps, any> {
  public render() {
    return (
      <div className="paddedText">
        <Editor readOnly editorState={this.props.text} onChange={() => {}} />
      </div>
    );
  }
}
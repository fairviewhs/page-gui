import React, { Component } from 'react';
import { EditorState, Editor } from 'draft-js';

export interface TableColumnProps {
  content: EditorState;
}

export default class TableColumn extends Component<TableColumnProps, any> {
  public render() {
    return (
      <div className="t-table-col">
      {/* More applicant information, including family, demographics (optional), educational, self-reported test scores, and activity lists. */}
      <Editor readOnly editorState={this.props.content} onChange={() => {}} />
      </div>
    );
  }
}
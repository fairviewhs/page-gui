/*import React, { Component, KeyboardEvent, MouseEvent } from 'react';
import { BasicInputComponent } from '../types';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, DraftBlockType, DraftEditorCommand, DraftHandleValue, ContentBlock } from 'draft-js-plugins-editor';
import classNames from 'classnames';

export default class ParagraphInput extends Component<BasicInputComponent<EditorState>, any> {
  editor: null | Editor = null;
  focus = () => {
    if (!!this.editor) this.editor.focus();
  };
  onChange = (editorState: EditorState) => this.props.onChange(editorState);

  handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  mapKeyToEditorCommand = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 9: // TAB
        const newEditorState = RichUtils.onTab(
          event,
          this.props.value,
          4, // maxDepth
        );
        if (newEditorState !== this.props.value) {
          this.onChange(newEditorState);
        }
        return null;
    }
    return getDefaultKeyBinding(event);
  }

  toggleBlockType = (blockType: DraftBlockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.props.value,
        blockType
      )
    );
  }

  toggleInlineStyle = (inlineStyle: string) => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.value,
        inlineStyle
      )
    );
  }

  render() {
    const editorState = this.props.value;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    const contentState = editorState.getCurrentContent();
    const className = classNames('RichEditor-editor', { 'RichEditor-hidePlaceholder': !contentState.hasText() && contentState.getBlockMap().first().getType() !== 'unstyled' })

    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <hr/>
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.onChange}
            placeholder="Enter Text Here"
            ref={(ref) => this.editor = ref}
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return '';
  }
}

class StyleButton extends Component<any> {
  onToggle = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    const className = classNames('RichEditor-styleButton', { 'RichEditor-activeButton': this.props.active });
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

// TODO: extract
const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'Unnumbered List', style: 'unordered-list-item'},
  {label: 'Numbered List', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

// TODO: extract
const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};*/


import React, { Component, Fragment } from 'react';
import { BasicInputComponent } from '../types';
import Editor, { createEditorStateWithText, EditorState } from 'draft-js-plugins-editor';
import { KeyBindingUtil, RichUtils, getDefaultKeyBinding } from 'draft-js';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';
import { ItalicButton, BoldButton, UnderlineButton, HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton, UnorderedListButton, OrderedListButton } from 'draft-js-buttons';
import { element } from 'prop-types';
import classNames from 'classnames';

import createToolbarPlugin from 'draft-js-static-toolbar-plugin';

import buttonStyles from './buttonStyles.module.css';
import toolbarStyles from './toolbarStyles.module.css';

const linkPlugin = createLinkPlugin();
const staticToolbarPlugin = createToolbarPlugin({
  theme: { buttonStyles, toolbarStyles }
});
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin, linkPlugin];


export default class ParagraphInput extends Component<BasicInputComponent<EditorState>, any> {
  editor: null | Editor = null;

  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
    this.props.onChange(editorState)
  }

  focus = () =>
    this.editor.focus();

  render() {
    const className = classNames('RichEditor-editor')
    const editorState = this.props.value;

    return (
      <Fragment>
        <div onClick={this.focus} className={className}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
            spellCheck={true}
          />
        </div>
        <Toolbar>
        {
              (externalProps) => (
                <Fragment>
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />

                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <linkPlugin.LinkButton {...externalProps} />
                </Fragment>
              )
            }
        </Toolbar>
      </Fragment>
    );
  }
}

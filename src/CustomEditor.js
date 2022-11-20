import { EditorState, RichUtils } from 'draft-js';
import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import MyDecorator1 from './MyDecorator1';
import MyDecorator2 from './MyDecorator2';

import { getDefaultKeyBinding, KeyBindingUtil, Modifier } from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;
const OPEN_DROPDOWN = 'OPEN-DROPDOWN';

const CaretCoordinates = {
  x: 0,
  y: 0,
};

function getCaretCoordinates() {
  const range = getSelectionRange();
  if (range) {
    const { left: x, top: y } = range.getBoundingClientRect();
    Object.assign(CaretCoordinates, { x, y });
  }
  return CaretCoordinates;
}

function getSelectionRange() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

class DropDownList extends Component {
  getMatchingSuggestions() {
    return ['Component1', 'Component2'];
  }

  get position() {
    const co = this.props.position;
    if (!co) return {};
    return {
      top: co.y,
      left: co.x,
      zIndex: 1000,
    };
  }

  render() {
    const entries = this.getMatchingSuggestions();
    return (
      entries && (
        <nav style={this.position} className="overlay suggestions">
          <ol className="suggestions-list">
            {entries.map((result, index) => {
              const select = () => this.props.onSelect(result);
              return (
                <li key={index} onMouseDown={select}>
                  {result}
                </li>
              );
            })}
          </ol>
        </nav>
      )
    );
  }
}

const addEntityAndComponent = (editorState, content) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const contentStateWithEntity = contentState.createEntity(content, 'IMMUTABLE', { content });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newContentState = Modifier.insertText(contentStateWithEntity, selection, content, null, entityKey);

  const newEditorState = EditorState.push(editorState, newContentState);

  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

class CustomEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      position: null,
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleKeyCommand = (commandString) => {
    if (commandString === OPEN_DROPDOWN) {
      this.setState({
        position: getCaretCoordinates(),
      });
      return true;
    }
    
    // handle rest of the commands
    const { editorState } = this.state;

    const newState = RichUtils.handleKeyCommand(editorState, commandString);
    if (newState) {
      this.onEditorStateChange(newState);
      return true;
    }
    return false;
  };

  myKeyBindingFn = (e) => {
    console.log(e.keyCode)
    if (e.keyCode === 75 /* `K` key */ && hasCommandModifier(e)) {
      return OPEN_DROPDOWN;
    }
    return getDefaultKeyBinding(e);
  };

  focus() {
    const se = this.state.editorState.getSelection();
    this.editor.focus();
    this.setState({
      editorState: EditorState.forceSelection(this.state.editorState, se),
    });
  }

  handleSuggestionSelected(text) {
    const { editorState } = this.state;
    const newEditorState = addEntityAndComponent(editorState, text);
    this.setState(
      {
        editorState: newEditorState,
      },
      () => {
        this.setState({
          position: null,
        });
      }
    );
    this.setState({ position: null }, () => {
      requestAnimationFrame(() => this.focus());
    });
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="editor" onClick={this.focus.bind(this)}>
        <Editor
          editorRef={(node) => (this.editor = node)}
          keyBindingFn={this.myKeyBindingFn}
          handleKeyCommand={this.handleKeyCommand.bind(this)}
          editorState={editorState}
          customDecorators={[MyDecorator1, MyDecorator2]}
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange.bind(this)}
        />
        <code>
          <pre>{JSON.stringify(editorState.getSelection(), null, 2)}</pre>
        </code>

        {this.state.position && (
          <DropDownList position={this.state.position} onSelect={this.handleSuggestionSelected.bind(this)} />
        )}
      </div>
    );
  }
}

export default CustomEditor;

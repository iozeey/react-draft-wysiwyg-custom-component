import { EditorState, RichUtils } from 'draft-js';
import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import MyDecorator1 from './MyDecorator1';
import MyDecorator2 from './MyDecorator2';
import DropDownList, { getMatchingSuggestions } from './DropDownList';

import { getDefaultKeyBinding, KeyBindingUtil, Modifier } from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;
const OPEN_DROPDOWN = 'OPEN-DROPDOWN';

const caretCoordinates = {
  x: 0,
  y: 0,
};

function getSelectionRange() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

function getCaretCoordinates(hasFocus, focusKey) {
  const range = getSelectionRange();

  if (range) {
    const { left: x, top: y } = range.getBoundingClientRect();
    Object.assign(caretCoordinates, { x, y });
  }

  if (hasFocus && caretCoordinates.x === 0 && caretCoordinates.y === 0) {
    // just grab the position of our editor current selection's block
    const currentSelectionNodeBounds = document
      .querySelector(`[data-offset-key^="${focusKey}"]`)
      .getBoundingClientRect();
    Object.assign(caretCoordinates, {
      x: currentSelectionNodeBounds.x,
      y: currentSelectionNodeBounds.y,
    });
  }
  return caretCoordinates;
}

const addEntityAndComponent = (editorState, content) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const contentStateWithEntity = contentState.createEntity(content, 'MUTABLE', { content, type: content });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newContentState = Modifier.insertText(contentStateWithEntity, selection, ` ${content} `, null, entityKey);

  const newEditorState = EditorState.push(editorState, newContentState, 'insert-new-component');

  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

const applySpace = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const newContentState2 = Modifier.insertText(contentState, selection, ' ');
  return EditorState.push(editorState, newContentState2);
};

const getEntityAtSelection = (editorState) => {
  const selectionState = editorState.getSelection();
  const selectionKey = selectionState.getStartKey();
  const contentState = editorState.getCurrentContent();

  // The block in which the selection starts
  const block = contentState.getBlockForKey(selectionKey);

  // Entity key at the start selection
  const entityKey = block.getEntityAt(selectionState.getStartOffset());
  if (entityKey) {
    // The actual entity instance
    const entityInstance = contentState.getEntity(entityKey);
    const entityInfo = {
      type: entityInstance.getType(),
      mutability: entityInstance.getMutability(),
      data: entityInstance.getData(),
    };
    return entityInfo;
  } else {
    return null;
  }
};

class CustomEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      position: null,
      isShowDropDown: false,
    };
  }

  isSelectionRange = (editorState) => {
    const s = editorState.getSelection();
    return s.getAnchorOffset() !== s.getFocusOffset();
  };

  onEditorStateChange = (editorState) => {
    const entityObject = getEntityAtSelection(editorState);
    if (entityObject && !this.isSelectionRange(editorState)) {
      if (getMatchingSuggestions().indexOf(entityObject.type) !== -1) {
        return this.setState({
          editorState,
          position: getCaretCoordinates(),
          isShowDropDown: true,
        });
      }
    }

    this.setState({ editorState });
  };

  handleKeyCommand = (commandString) => {
    console.log(commandString);
    if (commandString === OPEN_DROPDOWN) {
      const { editorState } = this.state;

      const focusKey = editorState.getSelection().getFocusKey();
      const hasFocus = this.state.editorState.getSelection()['hasFocus'];

      this.setState({
        position: getCaretCoordinates(hasFocus, focusKey),
        isShowDropDown: true,
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
    console.log(e.keyCode);
    if (e.keyCode === 75 /* `K` key */ && hasCommandModifier(e)) {
      return OPEN_DROPDOWN;
    }
    if ([27, 37, 39].indexOf(e.keyCode) !== -1) {
      this.closeDropDown();
    }

    return getDefaultKeyBinding(e);
  };

  closeDropDown = () => {
    this.setState({
      position: null,
      isShowDropDown: false,
    });
  };

  performOnClickActions() {
    // if not an entity the close the dropdown
    const entityObject = getEntityAtSelection(this.state.editorState);
    if (!entityObject) {
      this.closeDropDown();
    }
  }

  handleSuggestionSelected = (text) => {
    const { editorState } = this.state;
    const newEditorState = applySpace(addEntityAndComponent(applySpace(editorState), text));
    this.setState(
      {
        editorState: newEditorState,
      },
      () => {
        this.setState({
          position: null,
          isShowDropDown: false,
        });
      }
    );
    this.setState({ position: null, isShowDropDown: false }, () => {
      // readjust the cursor position based on new editor state
      const se = newEditorState.getSelection();
      this.editor.focus();
      this.setState({
        editorState: EditorState.forceSelection(newEditorState, se),
        isShowDropDown: false,
      });
    });
  };

  isShowAble = () => {
    const co = this.state.position;
    if (co && co.x > 0 && co.y > 0 && this.state.isShowDropDown) return true;

    const entityObject = getEntityAtSelection(this.state.editorState);

    if (entityObject && this.state.isShowDropDown && !this.isSelectionRange(this.state.editorState))
      return getMatchingSuggestions().indexOf(entityObject.type) !== -1;
    return false;
  };

  render() {
    const { editorState } = this.state;
    const ce = getEntityAtSelection(editorState);
    return (
      <div>
        <div className="editor-wrapper" onClick={this.performOnClickActions.bind(this)}>
          <Editor
            editorRef={(node) => (this.editor = node)}
            keyBindingFn={this.myKeyBindingFn}
            handleKeyCommand={this.handleKeyCommand.bind(this)}
            editorState={editorState}
            customDecorators={[MyDecorator1, MyDecorator2]}
            editorClassName="editor"
            onEditorStateChange={this.onEditorStateChange.bind(this)}
          />

          <DropDownList
            show={this.isShowAble() && !this.isSelectionRange(editorState)}
            activeItem={ce ? ce.type : null}
            position={this.state.position}
            onSelect={this.handleSuggestionSelected}
          />
        </div>
        <code>
          <pre>{JSON.stringify(getEntityAtSelection(editorState), null, 4)}</pre>
          <pre>{JSON.stringify(editorState.getSelection(), null, 4)}</pre>
        </code>
      </div>
    );
  }
}

export default CustomEditor;

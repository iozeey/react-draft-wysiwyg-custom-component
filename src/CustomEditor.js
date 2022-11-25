import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import DropDownList, { getMatchingSuggestions } from './DropDownList';
import MyDecorator1 from './MyDecorator1';
import MyDecorator2 from './MyDecorator2';

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
  const currentEntity = getEntityAtSelection(editorState);

  let contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const contentStateWithEntity = contentState.createEntity(content, 'MUTABLE', { content, type: content });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  let newContentState;
  if (currentEntity && currentEntity.entityKey) {
    const anchorKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(anchorKey);

    var myEntityRange = [];
    var myEntityText = '';
    var pText = contentState.getPlainText();
    block.getCharacterList().map((x, index) => {
      if (x.entity === currentEntity.entityKey) {
        myEntityRange.push(index);
        myEntityText += pText[index];
      }
      return myEntityRange;
    });

    const selectionToReBeReplace = selection.merge({
      anchorOffset: myEntityRange[0],
      focusOffset: myEntityRange[myEntityRange.length - 1] + 1,
    });

    newContentState = Modifier.replaceText(
      contentStateWithEntity,
      selectionToReBeReplace,
      ` ${content} `,
      null,
      entityKey
    );

    // ADD EXISTING CONTENT AS SIMPLE ENTITY
    const newEditorState1 = EditorState.push(editorState, newContentState, 'INSERT-EXISTING-OLD-AS-ENTITY');
    let contentState1 = newEditorState1.getCurrentContent();

    // const contentStateWithEntity1 = contentState1.createEntity(myEntityText, 'MUTABLE', { content, type: content });
    // const entityKey1 = contentStateWithEntity1.getLastCreatedEntityKey();

    newContentState = Modifier.insertText(
      contentState1,
      newEditorState1.getSelection(),
      myEntityText,
      null
      // entityKey1
    );
  } else newContentState = Modifier.insertText(contentStateWithEntity, selection, `${content}`, null, entityKey);

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
    // console.log(selectionState, JSON.stringify(selectionState), selectionKey, entityInstance);
    // console.log(JSON.stringify(entityInstance));
    const entityInfo = {
      type: entityInstance.getType(),
      mutability: entityInstance.getMutability(),
      data: entityInstance.getData(),
      entityKey,
    };
    return entityInfo;
  } else {
    return null;
  }
};

class CustomEditor extends Component {
  constructor(props) {
    super(props);
    const rawDataFromServer = `{"blocks":[{"key":"4ulh4","text":"importing selection  component and some other  Component1 with updated   Component1 Cupdatedomponent1 ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":10,"length":21,"key":0},{"offset":47,"length":10,"key":1},{"offset":72,"length":12,"key":2}],"data":{}},{"key":"dc1eh","text":" ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"Component2","mutability":"MUTABLE","data":{"content":"Component2","type":"Component2"}},"1":{"type":"Component1","mutability":"MUTABLE","data":{"content":"Component1","type":"Component1"}},"2":{"type":"Component1","mutability":"MUTABLE","data":{"content":"Component1","type":"Component1"}}}}`

    this.state = {
      editorState: EditorState.createEmpty(),
      position: null,
      isShowDropDown: false,
      rawData: rawDataFromServer,
    };
  }

  isSelectionRange = (editorState) => {
    const s = editorState.getSelection();
    return s.getAnchorOffset() !== s.getFocusOffset();
  };

  addOnCurrentSelection = (editorState, content) => {
    const currentSelection = editorState.getSelection();

    let contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);

    const contentStateWithEntity = contentState.createEntity(content, 'MUTABLE', {
      content,
      type: content,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const selectionToReBeReplace = currentSelection.merge({
      anchorOffset: currentSelection.getAnchorOffset(),
      focusOffset: currentSelection.getFocusOffset(),
    });

    let newContentState = Modifier.replaceText(
      contentStateWithEntity,
      selectionToReBeReplace,
      `${selectedText}`,
      null,
      entityKey
    );

    let es = EditorState.push(editorState, newContentState, 'Modify-Entity-Type');

    this.setState({ editorState: es, position: null, isShowDropDown: false });
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

    if (this.isSelectionRange(editorState)) {
      return this.setState({
        editorState,
        position: getCaretCoordinates(),
        isShowDropDown: true,
      });
    }

    this.setState({ editorState });
  };

  handleKeyCommand = (commandString) => {
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
    if (!entityObject && !this.isSelectionRange(this.state.editorState)) {
      this.closeDropDown();
    }
  }

  handleSuggestionSelected = (text) => {
    const { editorState } = this.state;
    if (this.isSelectionRange(editorState)) return this.addOnCurrentSelection(editorState, text);

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

    if (this.isSelectionRange(this.state.editorState)) return true;
    return false;
  };

  exportData = () => {
    const contentState = this.state.editorState.getCurrentContent();
    this.setState({ rawData: JSON.stringify(convertToRaw(contentState)) });
  };

  importData = () => {
    this.setState({ editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.rawData))) });
  };

  render() {
    const { editorState } = this.state;
    const ce = getEntityAtSelection(editorState);

    return (
      <div>
        <button onClick={this.exportData}>export</button>
        <button onClick={this.importData}>import</button>
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
            show={this.isShowAble()}
            activeItem={ce ? ce.type : null}
            position={this.state.position}
            onSelect={this.handleSuggestionSelected}
          />
        </div>
        <code>
          {/* <pre>{JSON.stringify(editorState.getSelection(), null, 4)}</pre> */}
          {/* <pre>{JSON.stringify(this.state.position, null, 4)}</pre> */}
          {/* <pre>{JSON.stringify(editorState.getCurrentContent(), null, 4)}</pre> */}
          {/* <pre>{JSON.stringify(editorState, null, 4)}</pre> */}
        </code>
      </div>
    );
  }
}

export default CustomEditor;

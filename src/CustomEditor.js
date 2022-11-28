import { getDefaultKeyBinding, KeyBindingUtil, RichUtils } from 'draft-js';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import addEntityAndComponent from './Components/addEntityAndComponent';
import addOnCurrentSelection from './Components/addOnCurrentSelection';
import applySpace from './Components/applySpace';
import getEntityAtSelection from './Components/getEntityAtSelection';
import { getCaretCoordinates, isSelectionRange } from './Components/Helper';
import { exportData } from './Components/ImportExport';
import DropDownList, { getMatchingSuggestions } from './DropDownList';
import MyDecorator1 from './MyDecorator1';
import MyDecorator2 from './MyDecorator2';

const { hasCommandModifier } = KeyBindingUtil;

const OPEN_DROPDOWN = 'OPEN-DROPDOWN';

const CustomEditor = ({ initialEditorState }) => {
  const [editorState, setEditorState] = useState(initialEditorState);
  const [position, setPosition] = useState(null);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const editor = useRef();
  // Just to show demo
  const [rawData, setRawData] = useState();
  const editorRef = () => editor.current;

  const onEditorStateChange = (editorState) => {
    const entityObject = getEntityAtSelection({ editorState });
    const focusKey = editorState.getSelection().getFocusKey();
    const hasFocus = editorState.getSelection()['hasFocus'];

    // if cursor at entity and that is not a selection
    if (entityObject && !isSelectionRange(editorState)) {
      if (getMatchingSuggestions().indexOf(entityObject.type) !== -1) {
        setPosition(getCaretCoordinates(hasFocus, focusKey));
        setIsShowDropDown(true);
      }
    }
    // if user has selected a range
    if (isSelectionRange(editorState)) {
      setPosition(getCaretCoordinates(hasFocus, focusKey));
      setIsShowDropDown(true);
    }

    setEditorState(editorState);
  };

  const handleKeyCommand = (commandString) => {
    if (commandString === OPEN_DROPDOWN) {
      const focusKey = editorState.getSelection().getFocusKey();
      const hasFocus = editorState.getSelection()['hasFocus'];

      setPosition(getCaretCoordinates(hasFocus, focusKey));
      setIsShowDropDown(true);
      return true;
    }

    const newState = RichUtils.handleKeyCommand(editorState, commandString);
    if (newState) {
      onEditorStateChange(newState);
      return true;
    }
    return false;
  };

  const myKeyBindingFn = (e) => {
    if (e.keyCode === 75 /* `K` key */ && hasCommandModifier(e)) {
      return OPEN_DROPDOWN;
    }
    if ([27, 37, 39].indexOf(e.keyCode) !== -1) {
      closeDropDown();
    }

    return getDefaultKeyBinding(e);
  };

  const closeDropDown = () => {
    setPosition(null);
    setIsShowDropDown(false);
  };

  const performAfterClickActions = () => {
    // if not an entity the close the dropdown
    const entityObject = getEntityAtSelection({ editorState });
    if (!entityObject && !isSelectionRange(editorState)) {
      closeDropDown();
    }
  };

  const handleSuggestionSelected = (text) => {
    let newEditorState;
    const entityObject = getEntityAtSelection({ editorState });

    if (isSelectionRange(editorState)) {
      // if user has selected a range
      newEditorState = addOnCurrentSelection(editorState, text );
      // return setEditorState(newEditorState);
    } else if (entityObject) {
      // if replacing entity type
      newEditorState = addEntityAndComponent({ editorState: editorState, content: text });
    } else {
      // normal adding entity
      newEditorState = applySpace({
        editorState: addEntityAndComponent({ editorState: applySpace({ editorState }), content: text }),
      });
    }

    setPosition(null);
    setIsShowDropDown(false);
    setEditorState(newEditorState);
  };

  const isShowAble = () => {
    const co = position;
    if (co && co.x > 0 && co.y > 0 && isShowDropDown) return true;

    const entityObject = getEntityAtSelection({ editorState });

    if (entityObject && isShowDropDown && !isSelectionRange(editorState))
      return getMatchingSuggestions().indexOf(entityObject.type) !== -1;

    if (isSelectionRange(editorState)) return true;
    return false;
  };

  const ce = getEntityAtSelection({ editorState });

  return (
    <div>
      <button onClick={() => setRawData(exportData(editorState.getCurrentContent()))}>export</button>
      <button onClick={() => setEditorState(initialEditorState)}>import</button>
      <div className="editor-wrapper" onClick={performAfterClickActions}>
        <Editor
          editorRef={editorRef}
          keyBindingFn={myKeyBindingFn}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customDecorators={[MyDecorator1, MyDecorator2]}
          editorClassName="editor"
          onEditorStateChange={onEditorStateChange}
        />

        <DropDownList
          show={isShowAble()}
          activeItem={ce ? ce.type : null}
          position={position}
          onSelect={handleSuggestionSelected}
        />
      </div>
      <code>
        {rawData && <pre style={{ whiteSpace: 'pre-wrap' }}>{rawData}</pre>}
        {/* <pre>{JSON.stringify(editorState.getSelection(), null, 4)}</pre> */}
        {/* <pre>{JSON.stringify(this.state.position, null, 4)}</pre> */}
        <pre>{JSON.stringify(editorState.getCurrentContent(), null, 4)}</pre>
        {/* <pre>{JSON.stringify(editorState, null, 4)}</pre> */}
      </code>
    </div>
  );
};

CustomEditor.propTypes = {
  initialEditorState: PropTypes.object,
};

export default CustomEditor;

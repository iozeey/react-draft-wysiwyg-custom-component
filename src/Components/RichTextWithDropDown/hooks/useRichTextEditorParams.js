import { useCallback, useRef, useState } from 'react';
import { convertToRaw, RichUtils } from 'draft-js';
import { hasSelection } from './useRichTextMenuParams';
import getEntityAtSelection from './../utils/getEntityAtSelection';
import { handleRichTextKeyDown, OPEN_DROPDOWN } from './../richTextAccessibility';

export const useRichTextEditorParams = (initialEditorState, { updateInfo, lastFocusKey }, menuItems, onChange) => {
  const [editorState, setEditorState] = useState(initialEditorState);
  const lastValue = useRef(() => {
    try {
      const rawContent = convertToRaw(editorState.getCurrentContent());
      return JSON.stringify(rawContent);
    } catch (e) {
      return '';
    }
  });

  // A required improvement to avoid calling onChange unnecessarily
  const _onChange = (rawContent) => {
    const newValue = JSON.stringify(rawContent);
    const valueString = lastValue.current;
    if (newValue !== valueString) {
      lastValue.current = newValue;
      onChange({ content: rawContent, value: newValue });
    }
  };

  const ref = useRef();

  const onEditorStateChange = (newEditorState) => {
    // Keep track of the previous content
    // A required improvement to avoid calling onChange unnecessarily
    // updateInfoAsNeeded()
    if(!hasSelection(newEditorState, menuItems)){
      updateInfo(null)
    }
    lastValue.current = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

    setEditorState(newEditorState);
  };

  const closeDropDown = () => updateInfo(null);

  const keyBindingFn = (e) => {
    return handleRichTextKeyDown(e, closeDropDown);
  };

  const handleKeyCommand = (commandString) => {
    if (commandString === OPEN_DROPDOWN) {
      const focusKey = editorState.getSelection().getFocusKey();
      const hasFocus = editorState.getSelection()['hasFocus'];
      updateInfo({ hasFocus, focusKey, ref });
      return true;
    }

    const newState = RichUtils.handleKeyCommand(editorState, commandString);
    if (newState) {
      onEditorStateChange(newState);
      return true;
    }

    return false;
  };
  const updateInfoAsNeeded = () => {
    const hasFocus = editorState.getSelection()['hasFocus'];
    const entityObject = getEntityAtSelection({ editorState });
    const entityKey = entityObject?.entityKey;

    const shouldToggle = entityObject && lastFocusKey === entityKey;

    if (shouldToggle || !hasSelection(editorState, menuItems, entityObject)) {
      updateInfo(null);
    } else {
      updateInfo({ hasFocus, entityKey, ref });
    }
  };

  const onClick = useCallback(updateInfoAsNeeded, [editorState, lastFocusKey, ref, menuItems, updateInfo]);

  return {
    onClick,
    ref,
    keyBindingFn,
    handleKeyCommand,
    editorState,
    setEditorState,
    onEditorStateChange,
    onChange: _onChange,
  };
};

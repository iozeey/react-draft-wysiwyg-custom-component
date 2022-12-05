import { EditorState, Modifier } from 'draft-js';

const addOnCurrentSelection = (editorState, menuItem ) => {
  const {value} = menuItem;
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const selectedText = currentContentBlock.getText().slice(start, end);

  const contentStateWithEntity = contentState.createEntity(value, 'MUTABLE', {
    type: value,
  });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const selectionToReBeReplace = selectionState.merge({
    anchorOffset: selectionState.getAnchorOffset(),
    focusOffset: selectionState.getFocusOffset(),
  });

  let newContentState = Modifier.replaceText(
    contentStateWithEntity,
    selectionToReBeReplace,
    `${selectedText}`,
    null,
    entityKey
  );

  return EditorState.push(editorState, newContentState, 'Modify-Entity-Type');
};

export default addOnCurrentSelection;

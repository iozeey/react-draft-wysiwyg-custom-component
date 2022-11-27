import { EditorState, Modifier } from 'draft-js';

const addOnCurrentSelection = (editorState, content ) => {
  let contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();
  var anchorKey = selectionState.getAnchorKey();
  var currentContent = editorState.getCurrentContent();
  var currentContentBlock = currentContent.getBlockForKey(anchorKey);
  var start = selectionState.getStartOffset();
  var end = selectionState.getEndOffset();
  var selectedText = currentContentBlock.getText().slice(start, end);

  const contentStateWithEntity = contentState.createEntity(content, 'MUTABLE', {
    type: content,
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

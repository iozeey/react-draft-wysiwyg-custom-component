import PropTypes from 'prop-types';

const getEntityAtSelection = ({ editorState }) => {
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

getEntityAtSelection.propTypes = {
  editorState: PropTypes.object,
};

export default getEntityAtSelection;

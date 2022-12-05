import {EditorState, Modifier} from 'draft-js';
import getEntityAtSelection from './getEntityAtSelection';

const addEntityAndComponent = ({ editorState, menuItem }) => {
  const {value, label} = menuItem;
  
  const currentEntity = getEntityAtSelection({editorState});

  let contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  let newContentState;
  if (currentEntity && currentEntity.entityKey) {
    const anchorKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(anchorKey);

    const myEntityRange = [];
    let myEntityText = null;
    const pText = contentState.getPlainText();
    block.getCharacterList().map((x, index) => {
      if (x.entity === currentEntity.entityKey) {
        myEntityRange.push(index);
        if (myEntityText === null) {
          myEntityText = pText[index];
        } else {
          myEntityText += pText[index];
        }
      }
      return myEntityRange;
    });

    const selectionToReBeReplace = selection.merge({
      anchorOffset: myEntityRange[0],
      focusOffset: myEntityRange[myEntityRange.length - 1] + 1,
    });

    const contentStateWithEntity = contentState.createEntity(value, 'MUTABLE', { type: value });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    newContentState = Modifier.replaceText(
      contentStateWithEntity,
      selectionToReBeReplace,
      myEntityText,
      null,
      entityKey
    );
  } else {
    const contentStateWithEntity = contentState.createEntity(value, 'MUTABLE', { type: value });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    newContentState = Modifier.insertText(contentStateWithEntity, selection, ` ${label} `, null, entityKey);
  }

  const newEditorState = EditorState.push(editorState, newContentState, 'insert-new-component');
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

export default addEntityAndComponent;

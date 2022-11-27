import { EditorState, Modifier } from 'draft-js';
import PropTypes from 'prop-types';
import getEntityAtSelection from './getEntityAtSelection';

const addEntityAndComponent = ({ editorState, content }) => {
  const currentEntity = getEntityAtSelection({editorState});

  let contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  let newContentState;
  if (currentEntity && currentEntity.entityKey) {
    const anchorKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(anchorKey);

    var myEntityRange = [];
    var myEntityText = null;
    var pText = contentState.getPlainText();
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

    const contentStateWithEntity = contentState.createEntity(content, 'MUTABLE', { type: content });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    newContentState = Modifier.replaceText(
      contentStateWithEntity,
      selectionToReBeReplace,
      myEntityText,
      null,
      entityKey
    );
  } else {
    const contentStateWithEntity = contentState.createEntity(content, 'MUTABLE', { type: content });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    newContentState = Modifier.insertText(contentStateWithEntity, selection, ` ${content} `, null, entityKey);
  }

  const newEditorState = EditorState.push(editorState, newContentState, 'insert-new-component');

  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

addEntityAndComponent.propTypes = {
  editorState: PropTypes.object,
  content: PropTypes.string,
};

export default addEntityAndComponent;

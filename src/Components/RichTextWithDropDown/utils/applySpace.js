import PropTypes from 'prop-types';

const applySpace = ({ editorState }) => {
  // FixMe: disable for now
  return editorState;
  // const contentState = editorState.getCurrentContent();
  // const selection = editorState.getSelection();
  // const newContentState2 = Modifier.insertText(contentState, selection, ' ');
  // return EditorState.push(editorState, newContentState2);
};

applySpace.propTypes = {
  editorState: PropTypes.object,
};

export default applySpace;

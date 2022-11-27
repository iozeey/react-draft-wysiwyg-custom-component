import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';

export const exportData = (currentContentState) => {
  //   const contentState = this.state.editorState.getCurrentContent();
  //   this.setState({ rawData: JSON.stringify(convertToRaw(currentContentState)) });
  return JSON.stringify(convertToRaw(currentContentState));
};

export const importData = (convertedToRawData) => {
  //   this.setState({ editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(rawData))) });
  return EditorState.createWithContent(convertFromRaw(JSON.parse(convertedToRawData)));
};

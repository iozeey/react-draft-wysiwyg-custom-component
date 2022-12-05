import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';

export const exportData = (currentContentState) => {
  //   const contentState = this.state.editorState.getCurrentContent();
  //   this.setState({ rawData: JSON.stringify(convertToRaw(currentContentState)) });
  return JSON.stringify(convertToRaw(currentContentState));
};

export const parseRichTextRawData = (value) => {
  if(!value){
    return EditorState.createEmpty();
  }
  
  try{
    const data = JSON.parse(value);
    return EditorState.createWithContent(convertFromRaw(data));
  }catch (e){
    return EditorState.createEmpty();
  }
};

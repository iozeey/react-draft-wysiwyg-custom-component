import PropTypes from 'prop-types';
import React from 'react';
import RichTextWithContentAssist from "./RichTextWithContentAssist";

export const getSampleMenuItems = () => {
  return [
    {value: 'cmp1', label: 'Component1', style: {backgroundColor: "red"}},
    {value: 'cmp2', label: 'Component2', style: {backgroundColor: "green"}},
    {value: 'cmp3', label: 'Component3', style: {backgroundColor: "blue"}}
  ];
};

const RichTextEditorExample = (props) => {
  const menuItems = getSampleMenuItems();
  
  return (
    <RichTextWithContentAssist {... props} menuItems={menuItems}/>
  );
};

RichTextEditorExample.propTypes = {
  initialEditorState: PropTypes.object,
};

export default RichTextEditorExample;

import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import DropDownList from './components/RichTextWithDropDown/DropDownList';
import { useRichTextEditorParams } from './components/RichTextWithDropDown/hooks/useRichTextEditorParams';
import { useRichTextMenuParams } from './components/RichTextWithDropDown/hooks/useRichTextMenuParams';
import { useRichTextInfo } from './components/RichTextWithDropDown/hooks/useRichTextInfo';
import { getRichTextMenuItemDecorator } from './components/RichTextWithDropDown/RichTextMenuItemDecorator';
import { EditorState } from 'draft-js';
import useOutSideClicked from './components/RichTextWithDropDown/hooks/useOutSideClicked';

const RichTextWithContentAssist = ({
  initialEditorState,
  menuItems,
  EditorComponent,
  DropDownComponent,
  onChange,
  ...rest
}) => {
  const wrapperRef = useRef(null);
  const { isOutSide, setIsOutSide } = useOutSideClicked(wrapperRef);
  const customDecorators = [getRichTextMenuItemDecorator(menuItems)];
  const menuInfo = useRichTextInfo();
  const editorProps = useRichTextEditorParams(initialEditorState, menuInfo, menuItems, onChange);
  const menuProps = useRichTextMenuParams(editorProps, menuInfo, menuItems);
  const { onClick, ref: editorRef, ...restEditorProps } = editorProps;

  if (isOutSide) {
    menuInfo.updateInfo(null);
    setIsOutSide(false);
  }

  return (
    <div onClick={onClick} ref={wrapperRef}>
      <EditorComponent {...restEditorProps} ref={editorRef} customDecorators={customDecorators} {...rest} />
      <DropDownComponent items={menuItems} editorRef={editorRef} {...menuProps} />
    </div>
  );
};

RichTextWithContentAssist.propTypes = {
  initialEditorState: PropTypes.object,
  menuItems: PropTypes.array,
  onChange: PropTypes.func,

  // Used to provide a way to enable extensibility
  EditorComponent: PropTypes.func,
  DropDownComponent: PropTypes.func,
};

RichTextWithContentAssist.defaultProps = {
  initialEditorState: EditorState.createEmpty(),
  EditorComponent: Editor,
  DropDownComponent: DropDownList,
};

export default RichTextWithContentAssist;

const caretCoordinates = {
  x: 0,
  y: 0,
};

export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

export const getCaretCoordinates = (hasFocus, focusKey, editorRef) => {
  const range = getSelectionRange();

  if (range) {
    const { left: x, top: y } = range.getBoundingClientRect();
    const editor = editorRef.current
    const editorBounds = editorRef.current.getBoundingClientRect()
    const toolbar = document.getElementsByClassName("rdw-editor-toolbar")[0].getBoundingClientRect()
    const editorPadding = parseFloat(document.defaultView.getComputedStyle(editor, "").getPropertyValue("padding").replace("px",""));
    Object.assign(caretCoordinates, { x: x - (x - editorBounds.x > 0 ? editorBounds.x : 0)  , y: y + toolbar.height - editorPadding - (y - editorBounds.y > 0 ? editorBounds.y  : 0)});
  }

  return caretCoordinates;
};

export const isSelectionRange = (editorState) => {
  const s = editorState.getSelection();
  return s.getAnchorOffset() !== s.getFocusOffset();
};

const caretCoordinates = {
  x: 0,
  y: 0,
};

export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

export const getCaretCoordinates = (hasFocus, focusKey) => {
  const range = getSelectionRange();

  if (range) {
    const { left: x, top: y } = range.getBoundingClientRect();
    Object.assign(caretCoordinates, { x, y });
  }

  if (hasFocus && caretCoordinates.x === 0 && caretCoordinates.y === 0) {
    // just grab the position of our editor current selection's block
    const currentSelectionNodeBounds = document
      .querySelector(`[data-offset-key^="${focusKey}"]`)
      .getBoundingClientRect();
    Object.assign(caretCoordinates, {
      x: currentSelectionNodeBounds.x,
      y: currentSelectionNodeBounds.y,
    });
  }
  return caretCoordinates;
};

export const isSelectionRange = (editorState) => {
  const s = editorState.getSelection();
  return s.getAnchorOffset() !== s.getFocusOffset();
};

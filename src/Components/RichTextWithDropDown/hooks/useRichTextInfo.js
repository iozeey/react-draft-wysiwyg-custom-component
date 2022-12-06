import useWindowScrollPosition from '@rooks/use-window-scroll-position';
import { offset as CaretOffset } from 'caret-pos';
import { useCallback, useState } from 'react';

export const useRichTextInfo = () => {
  const scroll = useWindowScrollPosition();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [lastEntityKey, setLastEntityKey] = useState(null);
  const [hasFocus, setHasFocus] = useState(false);

  const _setPosition = useCallback(
    (obj) => {
      if (obj) {
        const { hasFocus, entityKey, ref } = obj;
        const position = getCaretPosition(ref, scroll);

        setPosition(position);
        setHasFocus(hasFocus);
        setIsShowDropDown(true);
        setLastEntityKey(entityKey);
      } else {
        setHasFocus(false);
        setPosition({ x: 0, y: 0 });
        setIsShowDropDown(false);
        setLastEntityKey(null);
      }
    },
    [scroll]
  );

  return {
    updateInfo: _setPosition,
    position,
    hasFocus,
    setHasFocus,
    isShowDropDown,
    lastFocusKey: lastEntityKey,
    setLastFocusKey: setLastEntityKey,
  };
};

export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

export const RePosition = (ref, position, {scrollY}, dropDownHeight) => {
  const domNode = ref?.current?.wrapper;
  if (!domNode) {
    return { x: 0, y: 0 };
  }

  const docHeight = document.body.scrollHeight;
  const { top: caretPosition } = CaretOffset(domNode.querySelector('.public-DraftEditor-content'));

  if (dropDownHeight) {
    const caretBottomDistance = parseInt(docHeight) - parseInt(caretPosition);
    const isSmall = caretBottomDistance < parseInt(dropDownHeight);
    const yPlacement = isSmall ? caretPosition - scrollY - dropDownHeight - 10 : position.y;

    return { ...position, y: yPlacement };
  }

  return position;
};

export const getCaretPosition = (ref, { scrollX, scrollY }) => {
  const domNode = ref.current?.wrapper;
  if (!domNode) {
    return { x: 0, y: 0 };
  }

  const { top: y, left: x } = CaretOffset(domNode.querySelector('.public-DraftEditor-content'));
  return { x: x - scrollX - 50, y: y - scrollY + 20 };
};

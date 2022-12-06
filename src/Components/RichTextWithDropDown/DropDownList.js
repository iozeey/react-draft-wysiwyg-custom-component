import React, { useEffect, useMemo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';
import { RePosition } from './hooks/useRichTextInfo';
import useWindowScrollPosition from '@rooks/use-window-scroll-position';
import { useState } from 'react';
import { useRef } from 'react';

const DropDownList = ({
  position,
  show,
  onSelect,
  activeItem,
  items,
  id = 'drop-down-wrapper',
  editorRef,
}) => {
  const scroll = useWindowScrollPosition();
  const [isSecretlyRender, setIsSecretlyRender] = useState(true);
  const [dropDownHeight, setDropDownHeight] = useState();

  const dropDownRef = useRef();

  useEffect(() => {
    if (dropDownRef?.current) {
      setDropDownHeight(dropDownRef?.current.scrollHeight);
      setIsSecretlyRender(false);
    }
  }, []);

  const positionValue = useMemo(() => {
    if (!position) {
      return {};
    }

    let { x, y } = position;

    if (editorRef && dropDownHeight) {
      const rp = RePosition(editorRef, position, { scrollY: scroll?.scrollY }, dropDownHeight);
      x = rp.x;
      y = rp.y;
    }
    return { top: isNaN(y) ? 0 : y, left: isNaN(x) ? 0 : x, zIndex: 1000};
  }, [position, editorRef, dropDownHeight, scroll]);

  const itemElements = useMemo(
    () =>
      items.map((item) => {
        const { value, label } = item;
        return (
          <Dropdown.Item active={activeItem === value} key={value} eventKey={value.toString()}>
            {label?.toString()}
          </Dropdown.Item>
        );
      }),
    [items, activeItem]
  );

  return (
    <Dropdown
      ref={dropDownRef}
      id={id}
      autoClose="outside"
      role="menu"
      show={isSecretlyRender || show}
      className={`position-fixed ${isSecretlyRender ? 'visibility-hidden' : ''}`}
      focusFirstItemOnShow="keyboard"
      style={positionValue}
      onSelect={onSelect}
    >
      <Dropdown.Menu show={isSecretlyRender || show}>{itemElements}</Dropdown.Menu>
    </Dropdown>
  );
};

DropDownList.propTypes = {
  position: PropTypes.object,
  show: PropTypes.bool,
  onSelect: PropTypes.func,
  items: PropTypes.array,
  activeItem: PropTypes.string,
};

export default DropDownList;

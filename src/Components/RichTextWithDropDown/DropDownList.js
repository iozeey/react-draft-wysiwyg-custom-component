import React, {useMemo} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from "prop-types";

const DropDownList = ({position, show, onSelect, activeItem, items})=>{
  const positionValue = useMemo(()=>{
    if(!position){
      return {};
    }
    
    const {x, y} = position;
    return {top: isNaN(y) ? 0: y, left: isNaN(x) ? 0: x, zIndex: 1000,};
    
  }, [position]);
  
  const itemElements = useMemo(()=>items.map((item)=>{
    const {value, label} = item;
    return <Dropdown.Item active={activeItem === value} key={value} eventKey={value.toString()}>
      {label?.toString()}
    </Dropdown.Item>;
  }), [items, activeItem]);

  return <Dropdown
    autoClose="outside"
    role="menu"
    show={show}
    className={"position-fixed"}
    focusFirstItemOnShow="keyboard"
    style={{... positionValue}}
    onSelect={onSelect}
  >
    <Dropdown.Menu show={show}>
      {itemElements}
    </Dropdown.Menu>
  </Dropdown>;
};

DropDownList.propTypes = {
  position: PropTypes.object,
  show: PropTypes.bool,
  onSelect: PropTypes.func,
  items: PropTypes.array,
  activeItem: PropTypes.string
};

export default DropDownList;

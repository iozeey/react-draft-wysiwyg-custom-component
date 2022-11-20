import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export const getMatchingSuggestions = () => {
  return ['Component1', 'Component2'];
};
class DropDownList extends Component {
  get position() {
    const co = this.props.position;
    if (!co) return {};
    return {
      top: co.y,
      left: co.x,
      zIndex: 1000,
    };
  }

  render() {
    const entries = getMatchingSuggestions();
    return (
      <Dropdown
        className="overlay suggestions"
        autoClose="outside"
        id="cList"
        role="menu"
        show={this.props.show}
        focusFirstItemOnShow="keyboard"
        style={this.position}
        onSelect={(e) => {
          this.props.onSelect(e);
        }}
      >
        <Dropdown.Menu className="suggestions-list" show={this.props.show}>
          {entries.map((result, index) => {
            return (
              <Dropdown.Item
                active={this.props.activeItem === result}
                key={index}
                eventKey={result}
                href={`#${result}`}
              >
                {result}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default DropDownList;

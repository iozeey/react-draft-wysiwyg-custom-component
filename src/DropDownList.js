import Dropdown from 'react-bootstrap/Dropdown';
import React, { Component } from 'react';

class DropDownList extends Component {
  getMatchingSuggestions() {
    return ['Component1', 'Component2'];
  }

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
    const entries = this.getMatchingSuggestions();
    // return( <Dropdown>
    //   <Dropdown.Toggle variant="success" id="dropdown-basic">
    //     Dropdown Button
    //   </Dropdown.Toggle>

    //   <Dropdown.Menu>
    //     <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
    //     <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
    //     <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    //   </Dropdown.Menu>
    // </Dropdown>)
    return (
      <Dropdown
        className="overlay suggestions"
        autoClose="outside"
        id="cList"
        // role="menu"
        // navbar
        keydown={(e) => {
          console.log(e);
        }}
        show={this.props.show}
        focusFirstItemOnShow="keyboard"
        style={this.position}
        onSelect={(e) => {
          this.props.onSelect(e);
        }}
      >
        <Dropdown.Menu
          // ariaLabelledby="dropdown-basic"
          className="suggestions-list"
          show={this.props.show}
        >
          {entries.map((result, index) => {
            return (
              <Dropdown.Item active={this.props.activeItem === result} key={index} eventKey={result} href={`#index-${index}`}>
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

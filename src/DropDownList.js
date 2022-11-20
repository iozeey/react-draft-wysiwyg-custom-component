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

    return (
      entries && (
        <Dropdown
          show
          style={this.position}
          className="overlay suggestions"
          onSelect={(e) => {
            this.props.onSelect(e);
          }}
        >
          <Dropdown.Menu className="suggestions-list">
            {entries.map((result, index) => {

              return (
                <Dropdown.Item
                  key={index}
                  eventKey={result}
                 
                >
                  {result}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )
    );
  }
}

export default DropDownList;

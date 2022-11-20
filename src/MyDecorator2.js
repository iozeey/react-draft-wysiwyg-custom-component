import React from 'react';

const findMe = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();

    if (entityKey !== null && contentState.getEntity(entityKey).getType() === 'Component2') {
      return true;
    }
  }, callback);
};

const renderMe = (props) => <span  className='component-wrapper red'>{props.children}</span>;

const MyDecorator2 = {
  strategy: findMe,
  component: renderMe,
};

export default MyDecorator2;

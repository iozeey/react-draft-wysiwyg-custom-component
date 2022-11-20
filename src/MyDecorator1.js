import React from 'react';

const findMe = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();

    if (entityKey !== null && contentState.getEntity(entityKey).getType() === 'Component1') {
      return true;
    }
  }, callback);
};

const renderMe = (props) => <span className='component-wrapper green'>{props.children}</span>;

const MyDecorator1 = {
  strategy: findMe,
  component: renderMe,
};

export default MyDecorator1;

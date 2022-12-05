import React from "react";

export const getRichTextMenuItemDecorator = menuItems =>{
  const findMe = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if(!entityKey){
        return false;
      }
      
      const type = contentState.getEntity(entityKey).getType();
      return !!menuItems.find(({value})=> value === type);
    }, callback);
  };
  
  const renderMe = (att) => {
    const {children, contentState, entityKey} = att;
    const type = contentState.getEntity(entityKey).getType();
    const menuItem = menuItems.find(({value})=> value === type);
    if(!menuItem){
      return children;
    }
    
    // eslint-disable-next-line no-unused-vars
    const {value, label, ... rest} = menuItem;
    return <span {... rest}>{children}</span>;
  };
  
  return { strategy: findMe, component: renderMe,}
};

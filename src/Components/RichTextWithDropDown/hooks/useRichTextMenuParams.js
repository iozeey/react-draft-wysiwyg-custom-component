import {useCallback} from "react";
import getEntityAtSelection from "./../utils/getEntityAtSelection";
import addOnCurrentSelection from "./../utils/addOnCurrentSelection";
import addEntityAndComponent from "./../utils/addEntityAndComponent";
import applySpace from "./../utils/applySpace";
import {convertToRaw} from "draft-js";

export const useRichTextMenuParams = (props, {updateInfo, position, isShowDropDown}, menuItems) => {
  const {editorState, setEditorState, onChange} = props;
  const selection = getEntityAtSelection({editorState});
  const show = shouldShowMenu({ position, isShowDropDown });
  
  const onSelect = useCallback((key) => {
    const menuItem = menuItems.find(({value})=> value === key);
    if(menuItem){
      let newEditorState;
      const entityObject = getEntityAtSelection({editorState});
  
      if (isSelectionRange(editorState)) {
        // if user has selected a range
        newEditorState = addOnCurrentSelection(editorState, menuItem);
        // return setEditorState(newEditorState);
      } else if (entityObject) {
        // if replacing entity type
        newEditorState = addEntityAndComponent({editorState: editorState, menuItem});
      } else {
        // normal adding entity
        newEditorState = applySpace({
          editorState: addEntityAndComponent({editorState: applySpace({editorState}), menuItem}),
        });
      }
      
      if(onChange){
        // onChange event is not triggered when the value is updated externally. Thus, we need to call the onChange manually
        const newRawContent = convertToRaw(newEditorState.getCurrentContent());
        onChange(newRawContent);
      }
  
      setEditorState(newEditorState);
    }
    
    updateInfo(null);
  }, [editorState, selection, menuItems, onChange]);

  return {
    show,
    activeItem: selection?.type,
    position,
    onSelect
  }
};

export const isSelectionRange = (editorState) => {
  const selection = editorState.getSelection();
  return selection.getAnchorOffset() !== selection.getFocusOffset();
};

export const hasSelection = (
  editorState,
  menuItems,
  entityObject = getEntityAtSelection({editorState})
)=>{
  return !!findMenuItem(menuItems, entityObject) || isSelectionRange(editorState);
}

export const shouldShowMenu = ({position, isShowDropDown}) => {
  return position && position.x > 0 && position.y > 0 && isShowDropDown;
};

const findMenuItem = (menuItems, entityObject) => {
  const type = entityObject?.type;
  if(!type){
    return void 0;
  }
  
  return menuItems.find(({value}) => value === type);
};
import {getDefaultKeyBinding, KeyBindingUtil} from "draft-js";
const { hasCommandModifier,usesMacOSHeuristics } = KeyBindingUtil;
export const OPEN_DROPDOWN = "OPEN-DROPDOWN";

export const handleRichTextKeyDown = (event, closeDropDown) => {
  console.log(event.keyCode, event.ctrlKey,hasCommandModifier(event), usesMacOSHeuristics(event))
  if (event.keyCode === 75 /* `K` key */ && hasCommandModifier(event)) {
    return OPEN_DROPDOWN;
  };
  
  // Ctrl + Space
  if (event.keyCode === 32 && event.ctrlKey && (hasCommandModifier(event) || usesMacOSHeuristics(event))) {
    console.log("sin")
    return OPEN_DROPDOWN;
  }
  
  // if ([27, 37, 39, 32, 17].indexOf(event.keyCode) !== -1) {
  //   closeDropDown();
  // }
  
  return getDefaultKeyBinding(event);
};
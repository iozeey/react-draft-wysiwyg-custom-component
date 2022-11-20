import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import { getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator, Modifier } from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;

/* ----------*
* Constants
------------*/

const HASHTAGS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven'
];

/* ----------*
* Utils
------------*/

const getTriggerRange = (trigger) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const text = range.startContainer.textContent.substring(0, range.startOffset);
  if (/\s+$/.test(text)) return null;
  const index = text.lastIndexOf(trigger);
  if (index === -1) return null;

  return {
    text: text.substring(index),
    start: index,
    end: range.startOffset,
  };
};

const getInsertRange = (autocompleteState, editorState) => {
  const currentSelectionState = editorState.getSelection();
  const end = currentSelectionState.getAnchorOffset();
  const anchorKey = currentSelectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(anchorKey);
  const blockText = currentBlock.getText();
  const start = blockText.substring(0, end).lastIndexOf('#');

  return {
    start,
    end,
  };
};

/* ----------*
* Modifiers
------------*/

const addHashTag = (editorState, autocompleteState, hashtag) => {
  const { start, end } = getInsertRange(autocompleteState, editorState);
      
  const currentSelectionState = editorState.getSelection();
  
  const selection = currentSelectionState.merge({
    anchorOffset: start,
    focusOffset: end,
  });
  
  const contentState = editorState.getCurrentContent();
  
  const contentStateWithEntity = contentState.createEntity(
    'HASHTAG',
    'IMMUTABLE',
    {
      hashtag,
    },
  );
  
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    
  let newContentState = Modifier.replaceText(
    contentStateWithEntity,
    selection,
    `#${hashtag}`,
    null,
    entityKey,
  );
  
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    `insert-hashtag`,
  );
  
  return EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter(),
  );
};

/* ----------*
* Decorators
------------*/

const Hashtag = ({ children }) => {
  return (
    <span style={{ background: 'lightBlue' }}>{children}</span>
  );
};

const findHashtagEntities = (contentState, contentBlock, callback) => {
    contentBlock && contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'HASHTAG'
      );
    },
    callback,
  );
};


/* ----------*
* Components
------------*/

class Suggestions extends Component {
  render() {
    const { autocompleteState, renderSuggestion } = this.props;
    if (!autocompleteState) return null;
    const { searchText } = autocompleteState;
    return (
      <ul>
        {
          HASHTAGS
            .filter(item => item.substring(0, searchText.length) === searchText)
            .map(result => 
              <li className="suggestion" onMouseDown={() => renderSuggestion(result)}>
                {result}
              </li> 
            )
        }
      </ul>
    )
  }
}

class MyEditor extends Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([{
        strategy:  findHashtagEntities,
        component: Hashtag,
      }])

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      autocompleteState: null
    };
  }
  
  focus() {
    this.editor.focus();
  }
  
  onChange(editorState) {
    this.setState({editorState}, () => {
        const triggerRange = getTriggerRange('#');
                      
        if (!triggerRange) {
            this.setState({ autocompleteState: null });
            return;
        }
        
        this.setState({
            autocompleteState: {
                searchText: triggerRange.text.slice(1, triggerRange.text.length),
                selectedIndex: 0, 
            },
        });
    });
  }
  
  renderSuggestion(text) {
    const { editorState, autocompleteState } = this.state; 
        
    this.onChange(
      addHashTag(editorState, autocompleteState, text) 
    );
    
    this.setState({ autocompleteState: null });
  }
  
  render() {
    const { autocompleteState, editorState } = this.state;
    return (
      <div className="editor" onClick={this.focus.bind(this)}>
        <Editor
         ref={node => this.editor = node}
         editorState={editorState} 
         onChange={this.onChange.bind(this)}
         />
        <Suggestions 
          autocompleteState={autocompleteState}
          renderSuggestion={(text) => this.renderSuggestion(text)}
        />
      </div>
    );
  }
}

export default MyEditor;
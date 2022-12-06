import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './App.css';
import { parseRichTextRawData } from './components/RichTextWithDropDown/utils/ImportExport';
import RitchTextEditorExample from './RichTextEditorExample';

const rawDataFromServer = `{"blocks":[{"key":"4ulh4","text":"importing selection  component and some other  Component1 with updated   Component1 Cupdatedomponent1 ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":10,"length":21,"key":0},{"offset":47,"length":10,"key":1},{"offset":72,"length":12,"key":2}],"data":{}},{"key":"dc1eh","text":" ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"Component2","mutability":"MUTABLE","data":{"content":"Component2","type":"Component2"}},"1":{"type":"Component1","mutability":"MUTABLE","data":{"content":"Component1","type":"Component1"}},"2":{"type":"Component1","mutability":"MUTABLE","data":{"content":"Component1","type":"Component1"}}}}`;

const menuItems = [{label: "Test1", value: "test1", style: {backgroundColor: "red"}}, {label: "Test2", value: "test2", style: {backgroundColor: "green"}}];

const onChange = (props)=>{console.log(props)}
function App() {
  return (
    <div className="app">
      <div className="position-relative" style={{ paddingLeft: '80px', top: '70px' }}>
        <RitchTextEditorExample
          onChange={onChange}
          menuItems={menuItems}
          initialEditorState={parseRichTextRawData(rawDataFromServer)}
          toolbarClassName={'d-none'}
          editorClassName={'wysiwyg-text-editor embedded p-1'}
        />
      </div>
    </div>
  );
}

export default App;

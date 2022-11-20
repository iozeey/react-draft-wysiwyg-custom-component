import * as React from "react"
import * as Draft from "draft-js"

const regexStratergy = (block, callback) => {
  const text = block.getText()
  let result
  let regex = /(^|\s)#\w+/g
  while ((result = regex.exec(text)) != null) {
    let start = result.index
    let end = start + result[0].length
    callback(start, end)
  }
}

const regexComponent = props => (
  <span style={{ backgroundColor: "lightgreen" }}>{props.children}</span>
)

const compositeDecorator = new Draft.CompositeDecorator([
  {
    strategy: regexStratergy,
    component: regexComponent
  }
])

 class HashtagDecorator extends React.Component {
  state = { editorState: Draft.EditorState.createEmpty(compositeDecorator) }

  editorStateChanged = newEditorState =>
    this.setState({ editorState: newEditorState })

  render() {
    return (
      <div>
        <div className="editor">
          <Draft.Editor
            editorState={this.state.editorState}
            onChange={this.editorStateChanged}
          />
        </div>
      </div>
    )
  }
}
export default HashtagDecorator;
import { EditorView } from 'prosemirror-view'
import { ExampleSchema } from './schema'

import { Command } from './editor-types'

export class EditorViewProvider {
  _view?: EditorView<ExampleSchema>

  init(view: EditorView<ExampleSchema>) {
    this._view = view
  }

  get view(): EditorView<ExampleSchema> {
    if (!this._view) {
      throw Error('EditorViewProvider view accessed without EditorView instance')
    }
    return this._view
  }

  execCommand(cmd: Command) {
    cmd(this.view.state, this.view.dispatch)
    this.focus()
  }

  focus() {
    if (!this._view || this._view.hasFocus()) {
      return false
    }
    this._view.focus()
    this._view.dispatch(this._view.state.tr.scrollIntoView())
    return true
  }
}
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
      throw Error('EditorViewProvider editorView accessed without editorView instance')
    }
    return this._view
  }

  execCommand(cmd: Command) {
    cmd(this.view.state, this.view.dispatch)
  }
}
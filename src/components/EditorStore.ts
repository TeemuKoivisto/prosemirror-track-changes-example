import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { ExampleSchema } from 'pm/schema'

export class EditorStore {

  _view?: EditorView<ExampleSchema>
  jsonEditorState?: {[key: string]: any}
  localStorageKey: string

  constructor(key: string) {
    this.localStorageKey = key
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(this.localStorageKey)
      if (existing && existing !== null && existing.length > 0) {
        let stored = JSON.parse(existing)
        this.jsonEditorState = stored
      }
    }
  }

  setEditorView = (view: EditorView) => {
    this._view = view
    if (this.jsonEditorState) {
      const state = EditorState.fromJSON(
        {
          schema: this._view.state.schema,
          plugins: this._view.state.plugins,
        },
        this.jsonEditorState
      )
      this._view.updateState(state)
    }
  }

  syncCurrentEditorState = () => {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this._view?.state.toJSON()))
  }
}
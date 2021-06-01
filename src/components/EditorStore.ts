import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'

export class EditorStore {

  view?: EditorView
  currentEditorState?: {[key: string]: any}
  localStorageKey: string

  constructor(key: string) {
    this.localStorageKey = key
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(this.localStorageKey)
      if (existing && existing !== null && existing.length > 0) {
        let stored = JSON.parse(existing)
        this.currentEditorState = stored
      }
    }
  }

  setEditorView = (view: EditorView) => {
    this.view = view
    if (this.currentEditorState) {
      const state = EditorState.fromJSON(
        {
          schema: this.view.state.schema,
          plugins: this.view.state.plugins,
        },
        this.currentEditorState
      )
      this.view.updateState(state)
    }
  }

  syncCurrentEditorState = () => {
    const newState = this.view!.state.toJSON()
    localStorage.setItem(this.localStorageKey, JSON.stringify(newState))
  }
}
import { EditorState, PluginKey } from 'prosemirror-state'
import { EditorViewProvider } from './EditorViewProvider'
import { Observable } from './Observable'

export class PluginStateProvider {

  _observable = new Observable<PluginKey>()
  viewProvider: EditorViewProvider

  constructor(viewProvider: EditorViewProvider) {
    this.viewProvider = viewProvider
  }

  getPluginState(p: PluginKey) {
    if (this.viewProvider._view) {
      return p.getState(this.viewProvider.view.state)
    }
    return null
  }

  updatePluginListeners(oldEditorState: EditorState, newEditorState: EditorState) {
    Array.from(this._observable._observers.entries()).forEach(([p, subscribers]) => {
      const oldState = p.getState(oldEditorState)
      const newState = p.getState(newEditorState)
      if (oldState !== newState) {
        this._observable.emit(p, newState)
      }
    })
  }

  on(pluginKey: PluginKey, cb: (data: any) => void) {
    this._observable.on(pluginKey, cb)
  }

  off(pluginKey: PluginKey, cb: (data: any) => void) {
    this._observable.off(pluginKey, cb)
  }
}

import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { DiffPatcher } from 'jsondiffpatch'

import { trackChangesPluginKey } from 'pm/track-changes/track-changes-plugin'
import { print, recurseDeltas } from './recurseDeltas'

export class TrackChangesStore {
  view: EditorView
  startState: EditorState

  constructor(view: EditorView) {
    this.view = view
    this.startState = view.state
  }

  diff() {
    const trackChangesState = trackChangesPluginKey.getState(this.view.state)
    if (!trackChangesState) {
      return undefined
    }
    const state = this.view.state
    const currentDoc = state.doc
    const origDoc = trackChangesState.changeSet.startDoc
    const diffPatcher = new DiffPatcher({
      objectHash(node, index) {
        return node?.attrs?.id || `$$index: ${index}`
      },
      arrays: { detectMove: true, includeValueOnMove: false },
      textDiff: { minLength: 1 },
    })
    const diff = diffPatcher.diff(origDoc?.toJSON(), currentDoc.toJSON()) || {}
    const map = new Map()
    const changeTree = recurseDeltas(
      diff,
      currentDoc,
      0,
      currentDoc,
      origDoc,
      [],
      null,
      map
    )
    // this.emit('change-tree-updated', changeTree)
    print(changeTree)
    return changeTree
  }
}

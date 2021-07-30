import type { Command } from './editor-types'

export const setBlockNodeAttribute = () : Command => (state, dispatch) => {
  const cursor = state.selection.head
  const blockNodePos = state.doc.resolve(cursor).start(1) - 1
  const tr = state.tr.setNodeMarkup(blockNodePos, undefined, { dataTracked: Math.random().toString() })
  if (dispatch) {
    dispatch(tr)
    return true
  }
  return false
}
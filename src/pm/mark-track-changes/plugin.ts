import { DecorationSet } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { DOMSerializer } from 'prosemirror-model'

import { ExampleSchema } from '../schema'

export interface MarkTrackChangesState {
  userColors: Map<string, [string, string]>
  userID: string
}

export const markTrackChangesPluginKey = new PluginKey<MarkTrackChangesState, ExampleSchema>('mark-track-changes')

const colorScheme: [string, string][] = [
  ['greenyellow', '#ffa4a4'],
  ['#10c727', '#ff0707'],
  ['#7adcb8', '#f93aa2']
]

export const markTrackChangesPlugin = () => {

  return new Plugin<MarkTrackChangesState, ExampleSchema>({
    key: markTrackChangesPluginKey,
    state: {
      init(config, state) {
        return {
          userColors: new Map(),
          userID: '1',
        }
      },

      apply(tr, value, oldState, newState) {
        if (tr.getMeta('set-userID')) {
          return { ...value, userID: tr.getMeta('set-userID') }
        }
        const { userColors, userID } = value
        if (!userColors.has(userID)) {
          userColors.set(userID, colorScheme[userColors.size])
        }
        return {
          userColors,
          userID,
        }
      },
    },
    filterTransaction(tr, editorState) {
      return true
    },
    // appendTransaction(trs, _oldState, newState) {
    //   const rejectedChangeTr = trs.find(tr => !Number.isNaN(tr.getMeta('reject-change')))
    //   const rejectedChangeIndex = Number(rejectedChangeTr?.getMeta('reject-change'))
    //   const trackState = trackChangesPluginKey.getState(newState)
    //   if (!Number.isNaN(rejectedChangeIndex) && trackState) {
    //     const { changeSet, startState } = trackState
    //     return rejectChange(rejectedChangeIndex, changeSet, startState, newState)
    //   }
    //   return null
    // },
  })
}
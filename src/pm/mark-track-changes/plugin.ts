import { DecorationSet } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { DOMSerializer } from 'prosemirror-model'

import { ExampleSchema } from '../schema'

import { trackTransaction } from './trackTransaction'

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
      // console.log(tr.getMeta('tracked-tr'))
      // tr.steps.forEach((step, idx) => {
      //   console.log(step)
      // })
      return true
    },
    appendTransaction(trs, _oldState, newState) {
      const state = markTrackChangesPluginKey.getState(newState)
      let createdTr = newState.tr
      trs.forEach(tr => {
        createdTr = trackTransaction(tr, createdTr, state?.userID || '1')
      })
      return createdTr
    },
  })
}
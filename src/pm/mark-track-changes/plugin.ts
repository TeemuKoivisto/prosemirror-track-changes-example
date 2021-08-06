import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

import { schema, ExampleSchema } from '../schema'

import { Changes } from './changes'
import { trackTransaction } from './trackTransaction'

export interface MarkTrackChangesState {
  userColors: Map<string, [string, string]>
  userID: string
  changes: Changes
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
        const changes = new Changes([], [])
        state.doc.descendants((node, pos) => {
          const insertionMark = node.marks.find(m => m.type === schema.marks.insertion)
          const deletionMark = node.marks.find(m => m.type === schema.marks.deletion)
          if (node.isInline && insertionMark) {
            changes.pushChange({
              type: 'text-change',
              from: pos,
              to: pos + node.nodeSize, 
              data: insertionMark ? insertionMark : deletionMark
            })
          } else if (node.attrs.dataTracked) {
            changes.pushChange({
              type: 'node-change',
              from: pos,
              data: node.attrs.dataTracked
            })
          }
        })
        return {
          userColors: new Map(),
          userID: '1',
          changes,
        }
      },

      apply(tr, value, oldState, newState) {
        if (tr.getMeta('set-userID')) {
          return { ...value, userID: tr.getMeta('set-userID') }
        }
        const { userColors, userID, changes } = value
        if (!userColors.has(userID)) {
          userColors.set(userID, colorScheme[userColors.size])
        }
        const trackChanges = tr.getMeta('track-changes')
        if (trackChanges) {
          console.log(trackChanges)
        }
        return {
          userColors,
          userID,
          changes,
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
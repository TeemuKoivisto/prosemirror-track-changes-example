import { Plugin, PluginKey } from 'prosemirror-state'

import { getActiveMarks } from './getActiveMarks'

import { ExampleSchema } from '../schema'

export interface ActiveNodesMarksState {
  activeNodes: string[]
  activeMarks: string[]
}

export const activeNodesMarksPluginKey = new PluginKey<ActiveNodesMarksState, ExampleSchema>('active-nodes-marks')

export const activeNodesMarksPlugin = () => {
  return new Plugin<ActiveNodesMarksState, ExampleSchema>({
    key: activeNodesMarksPluginKey,
    state: {
      init(config, state) {
        return {
          activeNodes: [],
          activeMarks: [],
        }
      },

      apply(tr, pluginState, oldState, newState) {
        if (tr.docChanged || tr.selectionSet) {
          const marks = getActiveMarks(newState)
          const eqMarks = marks.every(m => pluginState.activeMarks.includes(m)) && marks.length === pluginState.activeMarks.length
          if (!eqMarks) {
            const nextPluginState = {
              ...pluginState,
              activeMarks: marks,
            }
            return nextPluginState
          }
        }
        return pluginState
      },
    },
  })
}

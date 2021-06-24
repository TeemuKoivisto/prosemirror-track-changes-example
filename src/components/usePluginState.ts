import { useState, useEffect } from 'react'
import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { ExampleSchema } from 'pm/schema'

import { useEditorContext } from 'pm/EditorContext'

// Modified from https://github.com/bangle-io/bangle.dev/blob/master/react/hooks.jsx

const updatePluginWatcher = (view: EditorView, watcher: Plugin<any, ExampleSchema>, remove = false) => {
  let state = view.state

  const newPlugins = remove
    ? state.plugins.filter((p) => p !== watcher)
    : [...state.plugins, watcher]

  state = state.reconfigure({
    plugins: newPlugins,
  })

  view.updateState(state)
}

export function usePluginState(pluginKey: PluginKey) {
  const { viewProvider } = useEditorContext()
  const [state, setState] = useState(viewProvider._view ? pluginKey.getState(viewProvider._view.state) : null)

  useEffect(() => {
    const view = viewProvider._view
    if (!view) return
    const plugin = watcherPlugin(pluginKey, setState)
    updatePluginWatcher(view, plugin)
    return () => {
      updatePluginWatcher(view, plugin, true)
    }
  }, [viewProvider._view, pluginKey])

  return state
}

export function watcherPlugin(pluginKey: PluginKey, setState: (newState: any) => void) {
  return new Plugin({
    // @ts-ignore
    key: new PluginKey(`withPluginState_${pluginKey.key}`),
    view() {
      return {
        update(view: EditorView, prevState: any) {
          const { state } = view
          if (prevState === state) {
            return
          }
          const newPluginState = pluginKey.getState(state)
          if (newPluginState !== pluginKey.getState(prevState)) {
            setState(newPluginState)
          }
        },
      }
    },
  })
}
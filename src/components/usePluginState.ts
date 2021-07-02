import { useState, useEffect } from 'react'
import { PluginKey } from 'prosemirror-state'

import { useEditorContext } from 'pm/EditorContext'

export function usePluginState<T>(pluginKey: PluginKey) {
  const { pluginStateProvider } = useEditorContext()

  const [state, setState] = useState<T | null>(pluginStateProvider.getPluginState(pluginKey))

  useEffect(() => {
    const cb = (pluginState: T) => {
      setState(pluginState)
    }
    pluginStateProvider.on(pluginKey, cb)
    return () => {
      pluginStateProvider.off(pluginKey, cb)
    }
  }, [pluginKey, pluginStateProvider])

  return state
}

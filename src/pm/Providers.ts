import { EditorViewProvider } from './EditorViewProvider'
import { PluginStateProvider } from './PluginStateProvider'

export interface IProviders {
  viewProvider: EditorViewProvider
  pluginStateProvider: PluginStateProvider
}

export const createDefaultProviders = (): IProviders => {
  const viewProvider = new EditorViewProvider()
  const pluginStateProvider = new PluginStateProvider(viewProvider)
  return {
    viewProvider,
    pluginStateProvider,
  }
}

import { EditorViewProvider } from './EditorViewProvider'

export interface IProviders {
  viewProvider: EditorViewProvider
}

export const createDefaultProviders = (): IProviders => {
  const viewProvider = new EditorViewProvider()
  return {
    viewProvider,
  }
}

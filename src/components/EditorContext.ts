import { createContext, useContext } from 'react'

import { EditorStore } from './EditorStore'

export type EditorContext = EditorStore

export const ReactEditorContext = createContext<EditorContext>(new EditorStore('editor-store'))

export const useEditorContext = () => useContext(ReactEditorContext)

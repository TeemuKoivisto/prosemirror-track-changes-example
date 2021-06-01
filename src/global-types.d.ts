declare module 'prosemirror-dev-tools' {
  import { EditorView } from "prosemirror-view"
  export const applyDevTools: (view: EditorView) => void
}

declare module 'prosemirror-example-setup' {
  import { Plugin } from 'prosemirror-state'
  export const exampleSetup: (options: Object) => Plugin[]
}
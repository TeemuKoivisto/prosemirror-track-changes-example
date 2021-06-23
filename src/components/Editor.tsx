import React, { useMemo } from 'react'
import debounce from 'lodash.debounce'

import { SelectUser } from './SelectUser'

import { EditorView } from 'prosemirror-view'
import { applyDevTools } from 'prosemirror-dev-tools'

import { PMEditor } from 'pm/PMEditor'
import { EditorStore } from './EditorStore'
import { ReactEditorContext } from './EditorContext'

export function Editor() {
  const editorStore = useMemo(() => new EditorStore('track-changes'), [])
  const debouncedSync = useMemo(() => debounce(editorStore.syncCurrentEditorState, 250), [])

  function handleEdit() {
    debouncedSync()
  }
  function handleEditorReady(view: EditorView) {
    editorStore.setEditorView(view)
    applyDevTools(view)
  }
  return (
    <ReactEditorContext.Provider value={editorStore}>
      <SelectUser/>
      <PMEditor
        onEdit={handleEdit}
        onEditorReady={handleEditorReady}
      />
    </ReactEditorContext.Provider>
  )
}
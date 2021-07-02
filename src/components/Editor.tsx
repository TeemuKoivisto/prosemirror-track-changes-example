import React, { useMemo } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import { EditorView } from 'prosemirror-view'
import { applyDevTools } from 'prosemirror-dev-tools'

import { Toolbar } from './Toolbar'
import { SelectUser } from './SelectUser'
import { ChangesList } from './ChangesList'

import { PMEditor } from 'pm/PMEditor'
import { EditorStore } from './EditorStore'
import { ReactEditorContext } from 'pm/EditorContext'
import { createDefaultProviders } from 'pm/Providers'

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
    <ReactEditorContext.Provider value={createDefaultProviders()}>
      <SelectUser/>
      <EditorWrapper>
        <div>
          <Toolbar />
          <PMEditor
            onEdit={handleEdit}
            onEditorReady={handleEditorReady}
          />
        </div>
        <ChangesList className="changes-list"/>
      </EditorWrapper>
    </ReactEditorContext.Provider>
  )
}

const EditorWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  width: 100%;
  .changes-list {
    margin-left: 1rem;
  }
`
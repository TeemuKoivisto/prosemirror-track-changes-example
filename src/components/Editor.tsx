import React, { useMemo } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import { EditorView } from 'prosemirror-view'
import { applyDevTools } from 'prosemirror-dev-toolkit'

import { useUIContext } from 'context/UIStore'

import { Toolbar } from './Toolbar'
import { SelectUser } from './SelectUser'
import { ChangesList } from './ChangesList'
import { TrackChangesPMState } from './TrackChangesPMState'
import { injectTrackChanges } from './track-changes-panel'

import { PMEditor } from 'pm/PMEditor'
import { EditorStore } from './EditorStore'
import { ReactEditorContext } from 'pm/EditorContext'
import { createDefaultProviders } from 'pm/Providers'

export function Editor() {
  const editorStore = useMemo(() => new EditorStore('track-changes'), [])
  const debouncedSync = useMemo(() => debounce(editorStore.syncCurrentEditorState, 250), [])
  const editorProviders = useMemo(() => createDefaultProviders(), [])
  const uiStore = useUIContext()

  function handleEdit() {
    debouncedSync()
  }
  function handleEditorReady(view: EditorView) {
    editorStore.setEditorView(view)
    applyDevTools(view)
    injectTrackChanges(view)
  }
  return (
    <ReactEditorContext.Provider value={editorProviders}>
      <SelectUser/>
      <ViewGrid>
        { uiStore.showTrackChangesPMState && <TrackChangesPMState className="track-changes"/>}
        <Toolbar className={`toolbar ${uiStore.showTrackChangesPMState ? '' : 'full-width'}`}/>
        <div className={`pm-editor ${uiStore.showTrackChangesPMState ? '' : 'full-width'}`}>
          <PMEditor
            onEdit={handleEdit}
            onEditorReady={handleEditorReady}
          />
        </div>
        <ChangesList className="changes-list"/>
      </ViewGrid>
    </ReactEditorContext.Provider>
  )
}

const ViewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 56px 71px auto;
  left: 0.5rem;
  margin-top: 1rem;
  position: absolute;
  right: 0.5rem;
  & > .track-changes {
    grid-column-start: 1;
    grid-row-start: 3;
    margin-bottom: 1rem;
  }
  & > .toolbar {
    grid-column-start: 2;
    grid-row-start: 1;
    &.full-width {
      grid-column-end: 3;
      grid-column-start: 1;
      grid-row-start: 1;
      margin-left: auto;
      max-width: 500px;
      width: 100%;
    }
  }
  & > .pm-editor {
    grid-column-start: 2;
    grid-row-start: 2;
    &.full-width {
      grid-column-end: 3;
      grid-column-start: 1;
      grid-row-start: 2;
      margin-left: auto;
    }
  }
  & > .changes-list {
    grid-column-start: 3;
    grid-row-start: 1;
    margin: 0.25rem;
  }
`

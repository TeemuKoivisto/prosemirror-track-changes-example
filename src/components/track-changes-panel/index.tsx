import React from 'react'
import ReactDOM from 'react-dom'
import { EditorView } from 'prosemirror-view'

import { TrackChangesContext } from './state/TrackChangesContext'
import { TrackChangesStore } from './state/TrackChangesStore'
import { TrackChangesControls } from './TrackChangesControls'

const CONTAINER_CLASS_NAME = '__track-changes__'

function createOrFindPlace() {
  let place: HTMLElement | null = document.querySelector(
    `.${CONTAINER_CLASS_NAME}`
  )

  if (!place) {
    place = document.createElement('div')
    place.className = CONTAINER_CLASS_NAME
    document.body.appendChild(place)
  }

  return place
}

export function injectTrackChanges(view: EditorView) {
  const place = createOrFindPlace()
  const store = new TrackChangesStore(view)
  ReactDOM.render(
    <TrackChangesContext.Provider
      value={{
        store,
      }}
    >
      <TrackChangesControls />
    </TrackChangesContext.Provider>,
    place
  )
}

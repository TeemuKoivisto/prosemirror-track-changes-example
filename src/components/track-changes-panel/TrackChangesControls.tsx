import React, { useState } from 'react'

import { TrackChangesBtn } from './TrackChangesBtn'
import { TrackChangesPanel } from './TrackChangesPanel'

export function TrackChangesControls() {
  const [active, setActive] = useState(false)

  function handleClickButton() {
    setActive(true)
  }
  function handleClosePanel() {
    setActive(false)
  }
  return active ? (
    <TrackChangesPanel onClose={handleClosePanel} />
  ) : (
    <TrackChangesBtn onClick={handleClickButton} />
  )
}

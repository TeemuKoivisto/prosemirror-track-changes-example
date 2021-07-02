import { createContext, useContext } from 'react'

import { TrackChangesStore } from './TrackChangesStore'

interface Context {
  store: TrackChangesStore
}

export const TrackChangesContext = createContext<Context>({} as Context)

export const useTrackChangesContext = () => useContext(TrackChangesContext)

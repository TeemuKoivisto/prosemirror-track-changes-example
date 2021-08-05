import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

import { Observable } from 'pm/Observable'

export class UIStore {

  _observable: Observable<string>
  showTrackChangesPMState: boolean

  constructor(store?: UIStore) {
    if (store) {
      this._observable = store._observable
      this.showTrackChangesPMState = store.showTrackChangesPMState
    } else {
      this._observable = new Observable<string>()
      this.showTrackChangesPMState = false
    }
  }

  update() {
    Array.from(this._observable._observers.entries()).forEach(([p, subscribers]) => {
      this._observable.emit(p, new UIStore(this))
    })
  }

  on(id: string, cb: (data: any) => void) {
    this._observable.on(id, cb)
  }

  off(id: string, cb: (data: any) => void) {
    this._observable.off(id, cb)
  }

  toggleTrackChangesPMState = () => {
    this.showTrackChangesPMState = !this.showTrackChangesPMState
    this.update()
  }
}

export const createStore = () => new UIStore()
export const UIContext = createContext<UIStore>(createStore())

export function useUIContext() {
  const store = useContext(UIContext)
  const [state, setState] = useState<UIStore>(store)
  const id = useMemo(() => Math.random().toString(), [])

  useEffect(() => {
    const cb = (val: UIStore) => {
      setState(val)
    }
    store.on(id, cb)
    return () => {
      store.off(id, cb)
    }
  }, [id, store])

  return state
}

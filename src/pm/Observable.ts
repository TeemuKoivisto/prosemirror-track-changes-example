/**
 * Modified from https://github.com/dmonad/lib0/blob/main/observable.js
 */
export class Observable<K = string> {
  _observers = new Map<K, Set<(args: any[]) => void>>()

  on(key: K, cb: (...args: any[]) => void) {
    const current = this._observers.get(key)
    if (current) {
      this._observers.set(key, new Set(current.add(cb)))
    } else {
      this._observers.set(key, new Set([cb]))
    }
  }

  off(key: K, cb: (...args: any[]) => void) {
    const observers = this._observers.get(key)
    if (observers) {
      observers.delete(cb)
      if (observers.size === 0) {
        this._observers.delete(key)
      }
    }
  }

  emit(key: K, ...args: any[]) {
    // TODO the typing of this annoying thing
    // @ts-ignore
    return Array.from((this._observers.get(key) || new Set()).values()).forEach(cb => cb(...args))
  }

  destroy() {
    this._observers = new Map()
  }
}
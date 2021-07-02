/* eslint-disable */

// ::- Stores metadata for a part of a change.
export class Span {

  length: number
  data: any

  constructor(length: number, data?: any) {
    // :: number
    this.length = length
    // :: any
    this.data = data
  }

  cut(length: number) {
    return length == this.length ? this : new Span(length, this.data)
  }

  static slice(spans: Span[], from: number, to: number) {
    if (from == to) return Span.none
    if (from == 0 && to == Span.len(spans)) return spans
    let result = []
    for (let i = 0, off = 0; off < to; i++) {
      let span = spans[i], end = off + span.length
      let overlap = Math.min(to, end) - Math.max(from, off)
      if (overlap > 0) result.push(span.cut(overlap))
      off = end
    }
    return result
  }

  static join(a: Span[], b: Span[], combine: (data1: any, data2: any) => any) {
    if (a.length == 0) return b
    if (b.length == 0) return a
    let combined = combine(a[a.length - 1].data, b[0].data)
    if (combined == null) return a.concat(b)
    let result = a.slice(0, a.length - 1)
    result.push(new Span(a[a.length - 1].length + b[0].length, combined))
    for (let i = 1; i < b.length; i++) result.push(b[i])
    return result
  }

  static len(spans: Span[]) {
    let len = 0
    for (let i = 0; i < spans.length; i++) len += spans[i].length
    return len
  }

  static get none() : Span[] {
    return []
  }
}

// Span.none = []

// ::- A replaced range with metadata associated with it.
export class Change {
  
  fromA: number
  toA: number
  fromB: number
  toB: number
  deleted: Span[]
  inserted: Span[]

  constructor(fromA: number, toA: number, fromB: number, toB: number, deleted: Span[], inserted: Span[]) {
    // :: number The start of the range deleted/replaced in the old
    // document.
    this.fromA = fromA
    // :: number The end of the range in the old document.
    this.toA = toA
    // :: number The start of the range inserted in the new document.
    this.fromB = fromB
    // :: number The end of the range in the new document.
    this.toB = toB
    // :: [Span] Data associated with the deleted content. The length
    // of these spans adds up to `this.toA - this.fromA`.
    this.deleted = deleted
    // :: [Span] Data associated with the inserted content. Length
    // adds up to `this.toB - this.toA`.
    this.inserted = inserted
  }

  get lenA() { return this.toA - this.fromA }
  get lenB() { return this.toB - this.fromB }

  slice(startA: number, endA: number, startB: number, endB: number) {
    if (startA == 0 && startB == 0 && endA == this.toA - this.fromA &&
        endB == this.toB - this.fromB) return this
    return new Change(this.fromA + startA, this.fromA + endA,
                      this.fromB + startB, this.fromB + endB,
                      Span.slice(this.deleted, startA, endA),
                      Span.slice(this.inserted, startB, endB))
  }

  // : ([Change], [Change], (any, any) → any) → [Change]
  // This merges two changesets (the end document of x should be the
  // start document of y) into a single one spanning the start of x to
  // the end of y.
  static merge(x: Change[], y: Change[], combine: (a: any, b: any) => any) : Change[] {
    if (x.length == 0) return y
    if (y.length == 0) return x

    let result = []
    // Iterate over both sets in parallel, using the middle coordinate
    // system (B in x, A in y) to synchronize.
    for (let iX = 0, iY = 0, curX: Change = x[0], curY: Change = y[0];;) {
      if (!curX && !curY) {
        return result
      } else if (curX && (!curY || curX.toB < curY.fromA)) { // curX entirely in front of curY
        let off = iY ? y[iY - 1].toB - y[iY - 1].toA : 0
        result.push(off == 0 ? curX :
                    new Change(curX.fromA, curX.toA, curX.fromB + off, curX.toB + off,
                               curX.deleted, curX.inserted))
        // @ts-ignore
        curX = iX++ == x.length ? null : x[iX]
      } else if (curY && (!curX || curY.toA < curX.fromB)) { // curY entirely in front of curX
        let off = iX ? x[iX - 1].toB - x[iX - 1].toA : 0
        result.push(off == 0 ? curY :
                    new Change(curY.fromA - off, curY.toA - off, curY.fromB, curY.toB,
                               curY.deleted, curY.inserted))
        // @ts-ignore
        curY = iY++ == y.length ? null : y[iY]
      } else { // Touch, need to merge
        // The rules for merging ranges are that deletions from the
        // old set and insertions from the new are kept. Areas of the
        // middle document covered by a but not by b are insertions
        // from a that need to be added, and areas covered by b but
        // not a are deletions from b that need to be added.
        let pos = Math.min(curX.fromB, curY.fromA)
        let fromA = Math.min(curX.fromA, curY.fromA - (iX ? x[iX - 1].toB - x[iX - 1].toA : 0)), toA = fromA
        let fromB = Math.min(curY.fromB, curX.fromB + (iY ? y[iY - 1].toB - y[iY - 1].toA : 0)), toB = fromB
        let deleted = Span.none, inserted = Span.none

        // Used to prevent appending ins/del range for the same Change twice
        let enteredX = false, enteredY = false

        // Need to have an inner loop since any number of further
        // ranges might be touching this group
        for (;;) {
          let nextX = !curX ? 2e8 : pos >= curX.fromB ? curX.toB : curX.fromB
          let nextY = !curY ? 2e8 : pos >= curY.fromA ? curY.toA : curY.fromA
          let next = Math.min(nextX, nextY)
          let inX = curX && pos >= curX.fromB, inY = curY && pos >= curY.fromA
          if (!inX && !inY) break
          if (inX && pos == curX.fromB && !enteredX) {
            deleted = Span.join(deleted, curX.deleted, combine)
            toA += curX.lenA
            enteredX = true
          }
          if (inX && !inY) {
            inserted = Span.join(inserted, Span.slice(curX.inserted, pos - curX.fromB, next - curX.fromB), combine)
            toB += next - pos
          }
          if (inY && pos == curY.fromA && !enteredY) {
            inserted = Span.join(inserted, curY.inserted, combine)
            toB += curY.lenB
            enteredY = true
          }
          if (inY && !inX) {
            deleted = Span.join(deleted, Span.slice(curY.deleted, pos - curY.fromA, next - curY.fromA), combine)
            toA += next - pos
          }

          if (inX && next == curX.toB) {
            // @ts-ignore
            curX = iX++ == x.length ? null : x[iX]
            enteredX = false
          }
          if (inY && next == curY.toA) {
            // @ts-ignore
            curY = iY++ == y.length ? null : y[iY]
            enteredY = false
          }
          pos = next
        }
        if (fromA < toA || fromB < toB)
          result.push(new Change(fromA, toA, fromB, toB, deleted, inserted))
      }
    }
  }
}
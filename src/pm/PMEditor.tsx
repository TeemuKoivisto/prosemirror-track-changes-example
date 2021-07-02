import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

import { schema } from './schema'
import { activeNodesMarksPlugin } from './active-nodes-marks'
import { trackChangesPlugin } from './track-changes/track-changes-plugin'

import { useEditorContext } from './EditorContext'

import './editor.css'
import './prosemirror-example-setup.css'
import './menu.css'

interface EditorProps {
  className?: string
  onEditorReady?: (view: EditorView) => void
  onEdit?: (state: EditorState) => void
}

export function PMEditor(props: EditorProps) {
  const { className = '' } = props
  const editorViewRef = useRef(null)
  const editorRef = useRef<EditorView | null>(null)
  const ctx = useEditorContext()

  useLayoutEffect(() => {
    const state = createEditorState()
    const editorViewDOM = editorViewRef.current
    if (editorViewDOM) {
      editorRef.current = createEditorView(editorViewDOM, state)
      ctx.viewProvider.init(editorRef.current)
      props.onEditorReady && props?.onEditorReady(editorRef.current)
    }
    return () => {
      editorRef.current?.destroy()
    }
  }, [])

  function createEditorState() {
    return EditorState.create({
      schema,
      plugins: exampleSetup({ schema }).concat(
        activeNodesMarksPlugin(),
        trackChangesPlugin(),
      ),
    })
  }

  function createEditorView(element: HTMLDivElement, state: EditorState) {
    const view = new EditorView({ mount: element }, {
      state,
      dispatchTransaction,
    })
    // @ts-ignore
    if (window) window.editorView = view
    return view
  }

  function dispatchTransaction(transaction: Transaction) {
    if (!editorRef.current) {
      return
    }
    const oldEditorState = editorRef.current.state
    const editorState = oldEditorState.apply(transaction)
    editorRef.current.updateState(editorState)
    ctx.pluginStateProvider.updatePluginListeners(oldEditorState, editorState)
    if (props.onEdit) {
      props.onEdit(editorState)
    }
  }

  return (
    <div id="example-editor" ref={editorViewRef} className={className}/>
  )
}

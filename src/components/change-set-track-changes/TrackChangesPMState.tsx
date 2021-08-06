import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { DOMSerializer } from 'prosemirror-model'

import { usePluginState } from '../usePluginState'
import { trackChangesPluginKey, TrackChangesState } from 'pm/track-changes/track-changes-plugin'

interface IProps {
  className?: string
}

export function TrackChangesPMState(props: IProps) {
  const { className } = props
  const [stateHTML, setStateHTML] = useState<string>('')
  const trackChangesPlugin = usePluginState<TrackChangesState>(trackChangesPluginKey)
  const lastStartState = useMemo(() => trackChangesPlugin?.startState, [trackChangesPlugin])
  const [serializer, setSerializer] = useState<DOMSerializer | undefined>()

  useEffect(() => {
    const newState = lastStartState
    if (!newState) {
      return
    }
    let domSerializer = serializer
    if (!domSerializer) {
      domSerializer = DOMSerializer.fromSchema(newState.schema)
      setSerializer(domSerializer)
    }

    const domFragment = domSerializer.serializeFragment(newState.doc.content)
    const html = []
    for (let i = 0; i < domFragment.children.length; i += 1) {
      const child = domFragment.children[i]
      html.push(child.outerHTML)
    }
    setStateHTML(html.join(''))
  }, [lastStartState])

  return (
    <Container className={className}>
      <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: stateHTML }}/>
    </Container>
  )
}

const Container = styled.div`
  border: 1px solid #222;
`
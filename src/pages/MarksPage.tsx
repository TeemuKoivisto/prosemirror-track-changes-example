import React from 'react'
import styled from 'styled-components'

import { Editor } from '../components/Editor'

export function MarksPage() {
  return (
    <Container>
      <header>
        <h1><a href="https://teemukoivisto.github.io/prosemirror-track-changes-example/">
          Track changes example</a></h1>
        <p>With marks instead of changeset</p>
        <p><a href="https://github.com/TeemuKoivisto/prosemirror-track-changes-example">Github repo</a></p>
      </header>
      <Editor markTrackChangesPlugin/>
    </Container>
  )
}

const Container = styled.div``

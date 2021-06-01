import * as React from 'react'
import styled from 'styled-components'

interface IProps {
  className?: string
}

export function PageHeader(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <header>
        <h1><a href="https://teemukoivisto.github.io/prosemirror-track-changes-example/">
          Track changes example</a></h1>
        <p>With prosemirror-changeset</p>
        <p><a href="https://github.com/TeemuKoivisto/prosemirror-track-changes-example">Github repo</a></p>
      </header>
    </Container>
  )
}

const Container = styled.div`
`

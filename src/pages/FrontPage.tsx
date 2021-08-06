import React from 'react'
import styled from 'styled-components'

import { PageHeader } from '../components/PageHeader'
import { Editor } from '../components/change-set-track-changes/ChangeSetEditor'

export function FrontPage() {
  return (
    <Container>
      <PageHeader/>
      <Editor/>
    </Container>
  )
}

const Container = styled.div``

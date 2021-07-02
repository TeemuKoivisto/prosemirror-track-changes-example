import React from 'react'
import styled from 'styled-components'

interface Props {
  onClick: () => void
}

export function TrackChangesBtn(props: Props) {
  const { onClick } = props
  return (
    <TrackChangesBtnWrapper onClick={onClick}>Diff</TrackChangesBtnWrapper>
  )
}

const TrackChangesBtnWrapper = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  background: #32c20e;
  border-radius: 4px;
  box-shadow: 0 0 30px rgb(0 0 0 / 30%);
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
  z-index: 99999;
`

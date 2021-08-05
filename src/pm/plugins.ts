import { exampleSetup } from 'prosemirror-example-setup'

import { activeNodesMarksPlugin } from './active-nodes-marks'
import { trackChangesPlugin } from './track-changes/track-changes-plugin'
import { markTrackChangesPlugin } from './mark-track-changes'

import { schema } from './schema'

export const plugins = () =>
  exampleSetup({ schema }).concat(
    activeNodesMarksPlugin(),
    trackChangesPlugin(),
  )

export const withMarkTrackChanges = () =>
  exampleSetup({ schema }).concat(
    activeNodesMarksPlugin(),
    markTrackChangesPlugin()
  )

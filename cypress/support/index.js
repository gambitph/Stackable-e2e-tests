import './wordpress'
import './gutenberg'
import './stackable'

// Use Jest assertions
import 'cypress-jest-adapter'
import 'cypress-real-events/support'

// Cypress Image Snapshot
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

addMatchImageSnapshotCommand( {
	failureThreshold: 0.00,
	failureThresholdType: 'percent',
	customDiffConfig: { threshold: 0.0 },
	capture: 'viewport',
} )

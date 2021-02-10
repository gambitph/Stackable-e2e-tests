// Make sure to remove this after developing
/// <reference types="Cypress" />

/**
 * External dependencies
 */
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests, responsiveAssertHelper,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Container Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/container', '.ugb-container' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/container' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks inside Advanced Columns and Grid', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/container' )

		blocks
			.filter( blockName => blockName !== 'ugb/container' )
			.forEach( blockName => cy.appendBlock( blockName ) )
	} )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/container', [
		{ value: 'Basic', selector: '.ugb-container--design-basic' },
		{ value: 'Plain', selector: '.ugb-container--design-plain' },
		{ value: 'Image', selector: '.ugb-container--design-image' },
		{ value: 'image2', selector: '.ugb-container--design-image2' },
		{ value: 'image3', selector: '.ugb-container--design-image3' },
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()

	// General Tab
	// Test Height
	// Test Content Width
	// Test Text Align

	// Container Tab
	// Test Borders

	// Background Tab
	// Test Single
	// Test Gradient
	// Test Image
	// Test Background Border

	// Spacing Tab
	// Test Padding

	// Text Colors
	// Test Link Colors
}

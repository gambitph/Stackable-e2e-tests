/**
 * External dependencies
 */
import {
	lowerCase,
} from 'lodash'

import {
	assertBlockExist, blockErrorTest, assertSeparators, registerTests, responsiveAssertHelper, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Spacer Block', registerTests( [
	blockExist,
	blockError,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/spacer', '.ugb-spacer' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/spacer' ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/spacer' ).as( 'spacerBlock' )
	const spacerBlock = registerBlockSnapshots( 'spacerBlock' )
	cy.openInspector( 'ugb/spacer', 'Style' )

	cy.collapse( 'General' )
	cy.adjust( 'Height', 142, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-spacer': {
			'height': '142px',
		},
	} )
	cy.resetStyle( 'Height' )
	cy.adjust( 'Height', 30, { viewport, unit: 'vh' } ).assertComputedStyle( {
		'.ugb-spacer': {
			'height': '30vh',
		},
	} )

	desktopOnly( () => {
		cy.adjust( 'Color Type', 'single' )
		cy.adjust( 'Background Color', '#000000' )
		cy.adjust( 'Background Color Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				'background-color': 'rgba(0, 0, 0, 0.6)',
			},
		} )

		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Background Color #1', '#ff5c5c' )
		cy.adjust( 'Background Color #2', '#7bff5a' )
		cy.adjust( 'Adv. Gradient Color Settings', {
			'Gradient Direction (degrees)': 160,
			'Color 1 Location': 28,
			'Color 2 Location': 75,
			'Background Gradient Blend Mode': 'hue',
		} ).assertComputedStyle( {
			'.ugb-spacer--inner:before': {
				'background-image': 'linear-gradient(160deg, #ff5c5c 28%, #7bff5a 75%)',
				'mix-blend-mode': 'hue',
			},
		} )

		cy.setBlockAttribute( {
			'backgroundMediaUrl': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		cy.adjust( 'Background Media Tint Strength', 6 ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
			},
			'.ugb-spacer--inner:before': {
				'opacity': '0.6',
			},
		} )
		cy.adjust( 'Fixed Background', true ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				'background-attachment': 'fixed',
			},
		} )
		cy.adjust( 'Adv. Background Image Settings', {
			'Image Blend Mode': 'exclusion',
		} ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				'background-blend-mode': 'exclusion',
			},
		} )
	} )

	cy.setBlockAttribute( { [ `${ viewport !== 'Desktop' ? `${ lowerCase( viewport ) }` : '' }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ) } )

	// Test Custom size px unit
	cy.adjust( 'Adv. Background Image Settings', {
		'Image Position': {
			viewport,
			value: 'top left',
		},
		'Image Repeat': {
			viewport,
			value: 'no-repeat',
		},
		'Image Size': {
			viewport,
			value: 'custom',
		},
		'Custom Size': {
			viewport,
			value: 806,
			unit: 'px',
		},
	} ).assertComputedStyle( {
		'.ugb-spacer--inner': {
			'background-size': '806px',
		},
	} )
	// Test Custom size vw unit
	cy.adjust( 'Adv. Background Image Settings', {
		'Image Size': {
			viewport,
			value: 'custom',
		},
		'Custom Size': {
			viewport,
			value: 44,
			unit: 'vw',
		},
	} ).assertComputedStyle( {
		'.ugb-spacer--inner': {
			'background-size': '44vw',
		},
	} )
	// Test Custom size % unit
	cy.adjust( 'Adv. Background Image Settings', {
		'Image Size': {
			viewport,
			value: 'custom',
		},
		'Custom Size': {
			viewport,
			value: 13,
			unit: '%',
		},
	} ).assertComputedStyle( {
		'.ugb-spacer--inner': {
			'background-size': '13%',
		},
	} )

	assertSeparators( { viewport } )
	spacerBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/spacer' ).as( 'spacerBlock' )
	const spacerBlock = registerBlockSnapshots( 'spacerBlock' )

	cy.openInspector( 'ugb/spacer', 'Advanced' )

	assertAdvancedTab( '.ugb-spacer', { viewport } )

	// Add more block specific tests.
	spacerBlock.assertFrontendStyles()
}

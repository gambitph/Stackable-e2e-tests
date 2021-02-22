/**
 * External dependencies
 */
import { blocks } from '~stackable-e2e/config'
import {
	assertAligns, assertBlockBackground, assertBlockExist, assertSeparators, blockErrorTest, switchLayouts, registerTests, responsiveAssertHelper, assertContainer,
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
	it( 'should allow adding inner blocks inside Container', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/container' )

		blocks
			.filter( blockName => blockName !== 'ugb/container' )
			.forEach( blockName => cy.addInnerBlock( 'ugb/container', blockName ) )

		cy.publish()
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

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/container' ).as( 'containerBlock' )
	const containerBlock = registerBlockSnapshots( 'containerBlock' )
	cy.openInspector( 'ugb/container', 'Style' )

	// General Tab
	cy.collapse( 'General' )

	// Test Height
	cy.adjust( 'Height', 'short', { viewport } ).assertComputedStyle( {
		'.ugb-container__side': {
			'padding-top': '35px',
			'padding-bottom': '35px',
		},
	} )
	cy.adjust( 'Height', 'normal', { viewport } ).assertComputedStyle( {
		'.ugb-container__side': {
			'padding-top': '0px',
			'padding-bottom': '0px',
		},
	} )
	cy.adjust( 'Height', 'tall', { viewport } ).assertComputedStyle( {
		'.ugb-container__side': {
			'padding-top': '120px',
			'padding-bottom': '120px',
		},
	} )
	cy.adjust( 'Height', 'half', { viewport } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			'min-height': '50vh',
		},
	} )
	cy.adjust( 'Height', 'full', { viewport } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			'min-height': '100vh',
		},
	} )

	// Test Content Vertical Align
	const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
	verticalAligns.forEach( align => {
		cy.adjust( 'Height', 'full', { viewport } )
			.adjust( 'Content Vertical Align', align, { viewport } )
			.assertComputedStyle( {
				'.ugb-container__wrapper': {
					'justify-content': align,
				},
			} )
	} )

	// Test Content Width
	cy.adjust( 'Content Width (%)', 50, { viewport } ).assertComputedStyle( {
		'.ugb-container__content-wrapper': {
			'width': '50%',
		},
	} )

	// Test Content Horizontal Align
	const horizontalAligns = [ 'flex-start', 'center', 'flex-end' ]
	horizontalAligns.forEach( align => {
		cy.adjust( 'Content Width (%)', 50, { viewport } )
			.adjust( 'Content Horizontal Align', align, { viewport } )
			.assertComputedStyle( {
				'.ugb-container__side': {
					'align-items': align,
				},
			} )
	} )

	// Test Text Align
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Container Tab
	cy.collapse( 'Container' )

	assertContainer( '.ugb-container__wrapper', { viewport }, 'column%sBackgroundMediaUrl' )

	// Spacing Tab
	cy.collapse( 'Spacing' )

	// Test Padding
	cy.adjust( 'Paddings', 30, { viewport } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			'padding-top': '30px',
			'padding-bottom': '30px',
			'padding-right': '30px',
			'padding-left': '30px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			'padding-top': '5em',
			'padding-bottom': '5em',
			'padding-right': '5em',
			'padding-left': '5em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 25, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			'padding-top': '25%',
			'padding-bottom': '25%',
			'padding-right': '25%',
			'padding-left': '25%',
		},
	} )

	// Text Colors Tab
	// Test Colors
	desktopOnly( () => {
		cy.collapse( 'Text Colors' )
		cy.adjust( 'Heading Color', '#8e8ee0' )
		cy.adjust( 'Text Color', '#24b267' )
		cy.adjust( 'Link Color', '#642c2c' )
		cy.adjust( 'Link Hover Color', '#ba89df' )

		cy.addInnerBlock( 'ugb/container', 'ugb/card' )
		cy.openInspector( 'ugb/card', 'Style' )
		cy.collapse( 'Button' )
		cy.adjust( 'Design', {
			label: 'Link',
			value: 'link',
		} ).assertComputedStyle( {
			'.ugb-card__title': {
				'color': '#8e8ee0',
			},
			'.ugb-card__subtitle': {
				'color': '#24b267',
			},
			'.ugb-card__description': {
				'color': '#24b267',
			},
			'.ugb-button': {
				'color': '#642c2c',
			},
		} )
	} )

	cy.selectBlock( 'ugb/container' )
	assertBlockBackground( '.ugb-container', { viewport } )
	assertSeparators( { viewport } )
	containerBlock.assertFrontendStyles()
}

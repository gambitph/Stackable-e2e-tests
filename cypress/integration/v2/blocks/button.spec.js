/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertBlockBackground, assertSeparators, assertAdvancedTab, assertTypography,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Button Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/button', '.ugb-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/button' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/button', [
		'Basic',
		{ value: 'Spread', selector: '.ugb-button--design-spread' },
		{ value: 'fullwidth', selector: '.ugb-button--design-fullwidth' },
		{ value: 'Grouped 1', selector: '.ugb-button--design-grouped-1' },
		{ value: 'Grouped 2', selector: '.ugb-button--design-grouped-2' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/button', [
		'Chic Button',
		'Decora Button',
		'Elevate Button',
		'Glow Button',
		'Heights Button',
		'Lume Button',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/button' ).as( 'buttonBlock' )
		registerBlockSnapshots( 'buttonBlock' )

		cy.typeBlock( 'ugb/button', '.ugb-button--inner', 'Hello World! 1234' )
			.assertBlockContent( '.ugb-button--inner', 'Hello World! 1234' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/button' ).as( 'buttonBlock' )
	const buttonBlock = registerBlockSnapshots( 'buttonBlock' )
	cy.openInspector( 'ugb/button', 'Style' )

	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Border Radius', 20 ).assertComputedStyle( {
			'.ugb-block-content .ugb-button': {
				'border-radius': '20px',
			},
		} )
		cy.adjust( 'Collapse Buttons On', 'tablet' )
			.assertClassName( '.ugb-button-wrapper', 'ugb-button--collapse-tablet' )
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-block-content': {
			'justify-content': 'flex-start',
		},
		'.ugb-inner-block': {
			'text-align': 'left',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-block-content': {
			'justify-content': 'center',
		},
		'.ugb-inner-block': {
			'text-align': 'center',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-block-content': {
			'justify-content': 'flex-end',
		},
		'.ugb-inner-block': {
			'text-align': 'right',
		},
	} )

	Array( 1, 2, 3 ).forEach( index => {
		cy.collapse( `Button #${ index }` )
		if ( index !== 1 ) {
			cy.toggleStyle( `Button #${ index }` )
		}
		cy.typeBlock( 'ugb/button', `.ugb-button${ index } .ugb-button--inner`, `Button ${ index }` )
		cy.waitFA()
		desktopOnly( () => {
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Button Color #1', '#a13939' )
			cy.adjust( 'Button Color #2', '#4e59d4' )
			cy.adjust( 'Gradient Direction (degrees)', 138 )
			cy.adjust( 'Text Color', '#ffa03b' )
			cy.adjust( 'Hover Effect', 'scale' )
				.assertClassName( `.ugb-button${ index }`, 'ugb--hover-effect-scale' )
			cy.adjust( 'Hover Opacity', 0.6 )
			cy.adjust( 'Hover Colors', {
				'Button Color #1': '#bd8b8b',
				'Button Color #2': '#3fa35b',
				'Gradient Direction (degrees)': 72,
				'Text Color': '#80194d',
			} )
			assertTypography( `.ugb-button${ index } .ugb-button--inner`, { enableLineHeight: false } )
			cy.adjust( 'Button Size', 'small' )
				.assertClassName( `.ugb-button${ index }`, 'ugb-button--size-small' )
			cy.adjust( 'Border Radius', 40 )
			cy.adjust( 'Vertical Padding', 15 )
			cy.adjust( 'Horizontal Padding', 43 )
			cy.adjust( 'Shadow', 4 )
			cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
				[ `.ugb-button${ index } .ugb-button--inner` ]: {
					'color': '#ffa03b',
				},
				[ `.ugb-button${ index }` ]: {
					'background-color': '#a13939',
					'background-image': 'linear-gradient(138deg, #a13939, #4e59d4)',
					'padding-top': '15px',
					'padding-right': '43px',
					'padding-bottom': '15px',
					'padding-left': '43px',
					'opacity': '0.6',
					'border-radius': '40px',
				},
			} )
			cy.adjust( 'Icon', 'info' )
			cy.adjust( 'Adv. Icon Settings', {
				'Icon Size': 41,
				'Icon Spacing': 25,
			} ).assertComputedStyle( {
				[ `.ugb-button${ index } svg` ]: {
					'height': '41px',
					'width': '41px',
					'margin-right': '25px',
				},
			} )
		} )

		if ( viewport !== 'Desktop' ) {
			assertTypography( `.ugb-button${ index } .ugb-button--inner`, {
				viewport,
				enableWeight: false,
				enableTransform: false,
				enableLineHeight: false,
				enableLetterSpacing: false,
			} )
		}
	} )

	assertBlockBackground( '.ugb-button-wrapper', { viewport } )
	assertSeparators( { viewport } )
	buttonBlock.assertFrontendStyles()
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/button' ).as( 'buttonBlock' )
	const buttonBlock = registerBlockSnapshots( 'buttonBlock' )

	cy.openInspector( 'ugb/button', 'Advanced' )

	assertAdvancedTab( '.ugb-button', {
		viewport,
		mainSelector: '.ugb-button-wrapper',
	} )

	// Add more block specific tests.
	buttonBlock.assertFrontendStyles()
}

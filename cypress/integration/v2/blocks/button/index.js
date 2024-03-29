/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertUgbButtons, assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, responsiveAssertHelper, assertBlockBackground, assertSeparators, assertAdvancedTab, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

export {
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
}

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
		cy.addBlock( 'ugb/button' ).asBlock( 'buttonBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/button', '.ugb-button--inner', 'Hello World! 1234', 0 )
			.assertBlockContent( '.ugb-button--inner', 'Hello World! 1234' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/button' ).asBlock( 'buttonBlock', { isStatic: true } )
		cy.openInspector( 'ugb/button', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@buttonBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert all Button options in ${ lowerCase( viewport ) }`, () => {
		Array( 1, 2, 3 ).forEach( index => {
			cy.collapse( `Button #${ index }` )
			if ( index !== 1 ) {
				cy.toggleStyle( `Button #${ index }` )
			}
			cy.typeBlock( 'ugb/button', `.ugb-button${ index } .ugb-button--inner`, `Button ${ index }`, 0 )
			cy.waitFA()
			desktopOnly( () => {
				cy.adjust( 'Link / URL', 'https://www.google.com/' ).assertHtmlAttribute( `.ugb-button${ index }`, 'href', 'https://www.google.com/', { assertBackend: false } )
				cy.adjust( 'Open link in new tab', true ).assertHtmlAttribute( `.ugb-button${ index }`, 'rel', /noopener noreferrer/, { assertBackend: false } )
				cy.adjust( 'Nofollow link', true ).assertHtmlAttribute( `.ugb-button${ index }`, 'rel', /nofollow/, { assertBackend: false } )
				cy.adjust( 'Sponsored', true ).assertHtmlAttribute( `.ugb-button${ index }`, 'rel', /sponsored/, { assertBackend: false } )
				cy.adjust( 'UGC', true ).assertHtmlAttribute( `.ugb-button${ index }`, 'rel', /ugc/, { assertBackend: false } )
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
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-button-wrapper', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )

	it( `should assert button URL popover in ${ lowerCase( viewport ) }`, () => {
		cy.openInspector( 'ugb/button', 'Style' )
		cy.toggleStyle( 'Button #2' )
		cy.toggleStyle( 'Button #3' )
		assertUgbButtons( 'ugb/button', 0, {
			editorSelector: '.ugb-button%s',
			frontendSelector: '.ugb-button%s',
			viewport,
		} )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/button' ).asBlock( 'buttonBlock', { isStatic: true } )

	cy.openInspector( 'ugb/button', 'Advanced' )

	assertAdvancedTab( '.ugb-button', {
		viewport,
		mainSelector: '.ugb-button-wrapper',
		customCssSelectors: [
			'.ugb-button1',
			'.ugb-button1 .ugb-button--inner',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@buttonBlock' )
}

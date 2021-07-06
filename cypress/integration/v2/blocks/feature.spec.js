/**
 * External dependencies
 */
import { startCase } from 'lodash'
import {
	assertAligns, assertBlockBackground, assertBlockExist, assertContainerLink, assertSeparators, assertTypography, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Feature Block', registerTests( [
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
	it( 'should show the block', assertBlockExist( 'ugb/feature', '.ugb-feature' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/feature' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/feature', [
		{ value: 'Basic', selector: '.ugb-feature--design-basic' },
		{ value: 'Plain', selector: '.ugb-feature--design-plain' },
		{
			value: 'half',
			selector: '.ugb-feature--design-half',
		},
		{
			value: 'overlap',
			selector: '.ugb-feature--design-overlap',
		},
		{
			value: 'overlap2',
			selector: '.ugb-feature--design-overlap2',
		},
		{
			value: 'overlap3',
			selector: '.ugb-feature--design-overlap3',
		},
		{
			value: 'overlap4',
			selector: '.ugb-feature--design-overlap4',
		},
		{
			value: 'overlap5',
			selector: '.ugb-feature--design-overlap5',
		},
		{
			value: 'overlap-bg',
			selector: '.ugb-feature--design-overlap-bg',
		},
		{
			value: 'overlap-bg2',
			selector: '.ugb-feature--design-overlap-bg2',
		},
		{
			value: 'overlap-bg3',
			selector: '.ugb-feature--design-overlap-bg3',
		},
		{
			value: 'overlap-bg4',
			selector: '.ugb-feature--design-overlap-bg4',
		},
		{
			value: 'overlap-bg5',
			selector: '.ugb-feature--design-overlap-bg5',
		},
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/feature', [
		'Angled Feature',
		'Arch Feature',
		'Aspire Feature 2',
		'Aspire Feature',
		'Aurora Feature',
		'Bean Feature 1',
		'Bean Feature 2',
		'Capital Feature',
		'Cary Feature',
		'Chic Feature',
		'Dare Feature',
		'Decora Feature',
		'Detour Feature',
		'Dim Feature',
		'Dustin Feature',
		'Elevate Feature',
		'Flex Feature',
		'Glow Feature',
		'Heights Feature',
		'Hue Feature',
		'Lounge Feature',
		'Lush Feature',
		'Peplum Feature',
		'Prime Feature',
		'Proact Feature',
		'Seren Feature',
		'Speck Feature',
		'Upland Feature',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/feature' ).as( 'featureBlock' )
		registerBlockSnapshots( 'featureBlock' )

		cy.typeBlock( 'ugb/feature', '.ugb-feature__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-feature__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/feature', '.ugb-feature__description', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-feature__description', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/feature', '.ugb-button--inner', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-button--inner', 'Hellooo World!!! 123' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.log( Cypress.env( 'STACKABLE_PREMIUM_CODE' ) )
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/feature' ).as( 'featureBlock' )
	const featureBlock = registerBlockSnapshots( 'featureBlock' )

	cy.openInspector( 'ugb/feature', 'Style' )

	// General Tab
	cy.collapse( 'General' )

	if ( viewport !== 'Mobile' ) {
		const assertionOptions = viewport === 'Tablet' ? { viewportFrontend: 783 } : {}

		cy.adjust( 'Image Column Width', 45, { viewport } ).assertComputedStyle( {
			'.ugb-feature__item': {
				'grid-template-columns': '1.10fr 0.90fr',
			},
		}, assertionOptions )
	}

	desktopOnly( () => {
		cy.adjust( 'Reverse Horizontally', true ).assertClassName( '.ugb-feature', 'ugb-feature--invert' )
	} )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Spacing Tab
	cy.collapse( 'Spacing' )

	cy.adjust( 'Title', 50, { viewport } )
	cy.adjust( 'Description', 33, { viewport } )
	cy.adjust( 'Button', 10, { viewport } ).assertComputedStyle( {
		'.ugb-feature__title': {
			'margin-bottom': '50px',
		},
		'.ugb-feature__description': {
			'margin-bottom': '33px',
		},
		'.ugb-button-container': {
			'margin-bottom': '10px',
		},
	} )

	// Image Tab
	cy.collapse( 'Image' )

	cy.setBlockAttribute( {
		'imageUrl': Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	cy.adjust( 'Border Radius', 33 )
	cy.adjust( 'Image Width', 300, { viewport } ).assertComputedStyle( {
		'.ugb-img': {
			'width': '300px',
			'border-radius': '33px',
		},
	} )
	desktopOnly( () => {
		cy.adjust( 'Force square image', true ).assertComputedStyle( {
			'.ugb-img': {
				'height': '300px',
			},
		} )
		cy.adjust( 'Shadow / Outline', 2 ).assertClassName( 'img.ugb-img', 'ugb--shadow-2' )
	} )

	desktopOnly( () => {
		cy.adjust( 'Shape', {
			label: 'Blob 1',
			value: 'blob1',
		} )
		cy.adjust( 'Flip Shape Horizontally', true )
		cy.adjust( 'Flip Shape Vertically', true )
		cy.adjust( 'Stretch Shape Mask', true ).assertClassName( 'img.ugb-img--shape', 'ugb-image--shape-stretch' )

		// We won't be able to assert image size for now since it requires server handling.

		cy.adjust( 'Alt Text (Alternative Text)', 'Hello World!' ).assertHtmlAttribute( '.ugb-img', 'alt', 'Hello World!' )
	} )

	// Title Tab and Description Tab
	const typographyAssertions = [ 'title', 'description' ]
	typographyAssertions.forEach( typographyAssertion => {
		const label = startCase( typographyAssertion )
		cy.collapse( label )
		if ( typographyAssertion === 'title' ) {
			desktopOnly( () => {
				cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-feature__title', 'h4' )
			} )
		}

		desktopOnly( () => {
			cy.adjust( `${ label } Color`, '#742f2f' ).assertComputedStyle( {
				[ `.ugb-feature__${ typographyAssertion }` ]: {
					'color': '#742f2f',
				},
			} )
		} )

		cy.adjust( 'Size', 55, { viewport, unit: 'px' } ).assertComputedStyle( {
			[ `.ugb-feature__${ typographyAssertion }` ]: {
				'font-size': '55px',
			},
		} )
		cy.adjust( 'Size', 2, { viewport, unit: 'em' } ).assertComputedStyle( {

			[ `.ugb-feature__${ typographyAssertion }` ]: {
				'font-size': '2em',
			},
		} )

		assertTypography( `.ugb-feature__${ typographyAssertion }`, { viewport } )
		assertAligns( 'Align', `.ugb-feature__${ typographyAssertion }`, { viewport } )
	} )

	// Test Button
	cy.collapse( 'Button' )
	cy.waitFA()

	desktopOnly( () => {
		const buttonDesigns = [ 'ghost', 'plain', 'link' ]
		buttonDesigns.forEach( design => {
			cy.adjust( 'Design', {
				label: startCase( design ),
				value: design,
			} ).assertClassName( '.ugb-button', `ugb-button--design-${ design }` )
		} )
		cy.adjust( 'Design', {
			label: 'Basic',
			value: 'basic',
		} )
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' ).assertClassName( '.ugb-button', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			'Button Color #1': '#bd8b8b',
			'Button Color #2': '#3fa35b',
			'Gradient Direction (degrees)': 72,
			'Text Color': '#80194d',
		} )
		cy.adjust( 'Button Size', 'small' ).assertClassName( '.ugb-button', 'ugb-button--size-small' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button .ugb-button--inner': {
				'color': '#ffa03b',
			},
			'.ugb-button': {
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

		cy.adjust( 'Icon', 'barcode' )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Size': 41,
			'Icon Spacing': 25,
		} ).assertComputedStyle( {
			'.ugb-button svg': {
				'height': '41px',
				'width': '41px',
				'margin-right': '25px',
			},
		} )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Position': 'Right',
		} ).assertClassName( '.ugb-button', 'ugb-button--icon-position-right' )
	} )

	assertTypography( '.ugb-button .ugb-button--inner', {
		viewport,
		enableLineHeight: false,
	} )
	assertAligns( 'Align', '.ugb-button-container', { viewport } )

	assertBlockBackground( '.ugb-feature', { viewport } )
	assertSeparators( { viewport } )
	assertContainerLink( '.ugb-feature__item', { viewport } )
	featureBlock.assertFrontendStyles()
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/feature' ).as( 'featureBlock' )
	const featureBlock = registerBlockSnapshots( 'featureBlock' )

	cy.openInspector( 'ugb/feature', 'Advanced' )

	assertAdvancedTab( '.ugb-feature', {
		viewport,
		customCssSelectors: [
			'.ugb-feature__title',
			'.ugb-feature__description',
			'.ugb-button',
			'.ugb-button--inner',
		],
	 } )

	// Add more block specific tests.

	featureBlock.assertFrontendStyles()
}

/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertContainerLink, registerTests, assertBlockTitleDescriptionContent, assertAligns, responsiveAssertHelper, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertTypography, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
import { range, startCase } from 'lodash'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Feature Grid Block', registerTests( [
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
	it( 'should show the block', assertBlockExist( 'ugb/feature-grid', '.ugb-feature-grid' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/feature-grid' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/feature-grid', [
		{ value: 'Basic', selector: '.ugb-feature-grid--design-basic' },
		{ value: 'Plain', selector: '.ugb-feature-grid--design-plain' },
		{ value: 'Horizontal', selector: '.ugb-feature-grid--design-horizontal' },
		{ value: 'Large Mid', selector: '.ugb-feature-grid--design-large-mid' },
		{ value: 'Zigzag', selector: '.ugb-feature-grid--design-zigzag' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/feature-grid', [
		'Angled Feature Grid',
		'Arch Feature Grid',
		'Aspire Feature Grid',
		'Aurora Feature Grid',
		'Bean Feature Grid',
		'Capital Feature Grid',
		'Chic Feature Grid',
		'Dare Feature Grid 1',
		'Dare Feature Grid 2',
		'Dare Feature Grid 3',
		'Decora Feature Grid',
		'Detour Feature Grid',
		'Devour Feature Grid',
		'Dim Feature Grid',
		'Dustin Feature Grid',
		'Elevate Feature Grid',
		'Flex Feature Grid',
		'Glow Feature Grid 1',
		'Glow Feature Grid 2',
		'Heights Feature Grid 1',
		'Heights Feature Grid 2',
		'Hue Feature Grid',
		'Lush Feature Grid 1',
		'Lush Feature Grid 2',
		'Peplum Feature Grid',
		'Prime Feature Grid',
		'Proact Feature Grid',
		'Propel Feature Grid',
		'Seren Feature Grid',
		'Speck Feature Grid',
		'Upland Feature Grid',
		'Yule Feature Grid',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/feature-grid' ).as( 'featureGridBlock' )
		registerBlockSnapshots( 'featureGridBlock' )

		cy.typeBlock( 'ugb/feature-grid', '.ugb-feature-grid__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-feature-grid__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/feature-grid', '.ugb-feature-grid__description', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-feature-grid__description', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/feature-grid', '.ugb-button--inner', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-button--inner', 'Hellooo World!!! 123' )

		cy.openInspector( 'ugb/feature-grid', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/feature-grid' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/feature-grid' ).as( 'featureGridBlock' )
	const featureGridBlock = registerBlockSnapshots( 'featureGridBlock' )

	cy.openInspector( 'ugb/feature-grid', 'Style' )

	cy.collapse( 'General' )
	cy.adjust( 'Columns', 3 )
	cy.get( '.ugb-feature-grid__item3' ).should( 'exist' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )
	cy.setBlockAttribute( {
		'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		'image3Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		'image4Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	assertContainer( '.ugb-feature-grid__item', { viewport }, 'column%sBackgroundMediaUrl' )
	cy.collapse( 'Image' )
	cy.adjust( 'Image Width', 29, { viewport } ).assertComputedStyle( {
		'.ugb-img': {
			'width': '29px',
		},
	} )
	desktopOnly( () => {
		cy.adjust( 'Force square image', true )
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			'margin-left': '0px',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			'margin-left': 'auto',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			'margin-left': 'auto',
			'margin-right': '0px',
		},
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
		// `assertHtmlAttribute` command was introduced for the purpose of asserting html attribute values in a selected DOM Element.
	} )

	cy.collapse( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-feature-grid__title', 'h4' )
		cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-feature-grid__title': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-feature-grid__title', { viewport } )
	assertAligns( 'Align', '.ugb-feature-grid__title', { viewport } )

	cy.collapse( 'Description' )
	desktopOnly( () => {
		cy.adjust( 'Description Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-feature-grid__description': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-feature-grid__description', { viewport } )
	assertAligns( 'Align', '.ugb-feature-grid__description', { viewport } )

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
		cy.adjust( 'Button Color', '#4e2e2e' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			'Button Color': '#371010',
		} )
		assertTypography( '.ugb-button--inner', { enableLineHeight: false, enableSize: false } )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-button', 'ugb-button--size-large' )
		cy.adjust( 'Opacity', 0.2 ).assertComputedStyle( {
			'.ugb-button': {
				'background-color': '#4e2e2e',
				'opacity': '0.2',
			},
		} )
		cy.adjust( 'Icon', 'info' )
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
	} )

	assertTypography( '.ugb-button--inner', {
		viewport,
		enableWeight: false,
		enableTransform: false,
		enableLineHeight: false,
		enableLetterSpacing: false,
	} )
	cy.collapse( 'Spacing' )

	cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-feature-grid__item': {
			'padding-top': '25px',
			'padding-right': '26px',
			'padding-bottom': '27px',
			'padding-left': '28px',
		},
	} )

	cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-feature-grid__item': {
			'padding-top': '3em',
			'padding-right': '4em',
			'padding-bottom': '5em',
			'padding-left': '6em',
		},
	} )

	cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-feature-grid__item': {
			'padding-top': '17%',
			'padding-right': '18%',
			'padding-bottom': '19%',
			'padding-left': '20%',
		},
	} )

	cy.adjust( 'Image', 13, { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			'margin-bottom': '13px',
		},
	} )

	cy.adjust( 'Title', 23, { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__title': {
			'margin-bottom': '23px',
		},
	} )

	cy.adjust( 'Description', 16, { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__description': {
			'margin-bottom': '16px',
		},
	} )

	cy.adjust( 'Button', 21, { viewport } ).assertComputedStyle( {
		'.ugb-button-container': {
			'margin-bottom': '21px',
		},
	} )

	desktopOnly( () => {
		cy.collapse( 'Effects' )
		const effects = [
			'shadow',
			'lift',
			'lift-more',
			'lift-shadow',
			'lift-staggered',
			'lift-shadow-staggered',
			'scale',
			'scale-more',
			'lower',
			'lower-more',
		]

		effects.forEach( effect => {
			cy.adjust( 'Hover Effect', effect ).assertClassName( '.ugb-feature-grid__item', `ugb--hover-${ effect }` )
		} )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-feature-grid', { viewport } )
	assertSeparators( { viewport } )
	assertContainerLink( '.ugb-feature-grid__item', { viewport } )
	featureGridBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/feature-grid' ).as( 'featureGridBlock' )
	const featureGridBlock = registerBlockSnapshots( 'featureGridBlock' )

	cy.openInspector( 'ugb/feature-grid', 'Advanced' )

	assertAdvancedTab( '.ugb-feature-grid', {
		viewport,
		customCssSelectors: [
			'.ugb-feature-grid__item',
			'.ugb-feature-grid__title',
			'.ugb-feature-grid__description',
			'.ugb-button',
			'.ugb-button .ugb-button--inner',
		],
	} )

	desktopOnly( () => {
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image3Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		range( 1, 4 ).forEach( idx => {
			cy.collapse( `Column #${ idx }` )
			cy.adjust( 'Column Background', '#a03b3b' ).assertComputedStyle( {
				[ `.ugb-feature-grid__item${ idx }` ]: {
					'background-color': '#a03b3b',
				},
			} )
			cy.collapse( `Image #${ idx }` )
			cy.adjust( 'Shape', {
				label: 'Blob 3',
				value: 'blob3',
			} )
			cy.adjust( 'Flip Shape Horizontally', true )
			cy.adjust( 'Flip Shape Vertically', true )
			cy.adjust( 'Stretch Shape Mask', true ).assertClassName( `.ugb-feature-grid__item${ idx } img.ugb-img--shape`, 'ugb-image--shape-stretch' )
		} )
	} )
	featureGridBlock.assertFrontendStyles()
}


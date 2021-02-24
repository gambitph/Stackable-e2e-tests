/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { range } from 'lodash'

const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Pricing Box Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/pricing-box', '.ugb-pricing-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/pricing-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/pricing-box', [
		{ value: 'Basic', selector: '.ugb-pricing-box--design-basic' },
		{ value: 'Plain', selector: '.ugb-pricing-box--design-plain' },
		{ value: 'Compact', selector: '.ugb-pricing-box--design-compact' },
		{ value: 'Colored', selector: '.ugb-pricing-box--design-colored' },
		{ value: 'Sectioned', selector: '.ugb-pricing-box--design-sectioned' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/pricing-box', [
		'Aurora Pricing Box',
		'Bean Pricing Box',
		'Cary Pricing Box',
		'Decora Pricing Box',
		'Detour Pricing Box',
		'Dim Pricing Box',
		'Dustin Pricing Box',
		'Elevate Pricing Box',
		'Flex Pricing Box',
		'Heights Pricing Box',
		'Hue Pricing Box',
		'Lounge Pricing Box',
		'Lume Pricing Box',
		'Lush Pricing Box',
		'Prime Pricing Box',
		'Speck Pricing Box',
		'Upland Pricing Box',
		'Yule Pricing Box',
	] ) )
}

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/pricing-box' ).as( 'pricingBoxBlock' )
	const pricingBoxBlock = registerBlockSnapshots( 'pricingBoxBlock' )

	cy.openInspector( 'ugb/pricing-box', 'Advanced' )

	assertAdvancedTab( '.ugb-pricing-box', { viewport } )

	desktopOnly( () => {
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		range( 1, 3 ).forEach( idx => {
			cy.collapse( `Column #${ idx }` )
			cy.adjust( 'Column Background', '#a03b3b' ).assertComputedStyle( {
				[ `.ugb-pricing-box__item${ idx }` ]: {
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
			cy.adjust( 'Stretch Shape Mask', true ).assertClassName( `.ugb-pricing-box__item${ idx } img.ugb-img--shape`, 'ugb-image--shape-stretch' )
		} )
	} )
	pricingBoxBlock.assertFrontendStyles()
}



/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, assertAligns, responsiveAssertHelper,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Feature Grid Block', registerTests( [
	//blockExist,
	//blockError,
	//switchLayout,
	//switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
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

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/feature-grid' )

	cy.openInspector( 'ugb/feature-grid', 'Style' )

	//cy.collapse( 'General' )
	//desktopOnly( () => {
	//cy.adjust( 'Columns', 4 )
	//cy.get( '.ugb-feature-grid__item4' ).should( 'exist' )
	//} )
	//assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	//cy.collapse( 'Container' )
	cy.setBlockAttribute( {
		[ `column${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image1Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image2Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image3Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image4Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )
	//desktopOnly( () => {
	//cy.adjust( 'Background', {
	//[ `Color Type` ]: 'gradient',
	//[ `Background Color #1` ]: '#ff5c5c',
	//[ `Background Color #2` ]: '#7bff5a',
	//[ `Adv. Gradient Color Settings` ]: {
	//[ `Gradient Direction (degrees)` ]: 160,
	//[ `Color 1 Location` ]: 28,
	//[ `Color 2 Location` ]: 75,
	//[ `Background Gradient Blend Mode` ]: 'hue',
	//},
	//[ `Background Media Tint Strength` ]: 6,
	//[ `Fixed Background` ]: true,
	//[ `Adv. Background Image Settings` ]: {
	//[ `Image Blend Mode` ]: 'exclusion',
	//},
	//} ).assertComputedStyle( {
	//'.ugb-feature-grid__item:before': {
	//[ `background-image` ]: 'linear-gradient(160deg, #ff5c5c 28%, #7bff5a 75%)',
	//[ `opacity` ]: '0.6',
	//[ `mix-blend-mode` ]: 'hue',
	//},
	//'.ugb-feature-grid__item': {
	//[ `background-color` ]: '#ff5c5c',
	//[ `background-attachment` ]: 'fixed',
	//[ `background-blend-mode` ]: 'exclusion',
	//},
	//} )
	//} )
	//cy.adjust( 'Background', {
	//[ `Adv. Background Image Settings` ]: {
	//[ `Image Position` ]: {
	//viewport,
	//value: 'center center',
	//},
	//[ `Image Repeat` ]: {
	//viewport,
	//value: 'repeat-x',
	//},
	//[ `Image Size` ]: {
	//viewport,
	//value: 'custom',
	//},
	//[ `Custom Size` ]: {
	//viewport,
	//value: 19,
	//unit: '%',
	//},
	//},
	//} ).assertComputedStyle( {
	//'.ugb-feature-grid__item': {
	//[ `background-position` ]: '50% 50%',
	//[ `background-repeat` ]: 'repeat-x',
	//[ `background-size` ]: '19%',
	//},
	//} )
	//desktopOnly( () => {
	//cy.adjust( 'Borders', 'solid' )
	//cy.adjust( 'Border Width', 4 )
	//cy.adjust( 'Border Color', '#a12222' )
	//cy.adjust( 'Border Radius', 26 ).assertComputedStyle( {
	//'.ugb-feature-grid__item': {
	//[ `border-style` ]: 'solid',
	//[ `border-top-width` ]: '4px',
	//[ `border-bottom-width` ]: '4px',
	//[ `border-left-width` ]: '4px',
	//[ `border-right-width` ]: '4px',
	//[ `border-color` ]: '#a12222',
	//[ `border-radius` ]: '26px',
	//},
	//} )
	//cy.adjust( 'Shadow / Outline', 7 )
	//.assertClassName( '.ugb-feature-grid__item', 'ugb--shadow-7' )
	//} )
	cy.collapse( 'Image' )
	cy.toggleStyle( 'Image', true )

	cy.adjust( 'Shape', 'Blob 1' )
}


/**
 * External dependencies
 */
import { range, startCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertContainer, assertTypography,
	// assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Team Member Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/team-member', '.ugb-team-member' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/team-member' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/team-member', [
		{ value: 'Basic', selector: '.ugb-team-member--design-basic' },
		{ value: 'Plain', selector: '.ugb-team-member--design-plain' },
		{ value: 'Horizontal', selector: '.ugb-team-member--design-horizontal' },
		{ value: 'Overlay', selector: '.ugb-team-member--design-overlay' },
		{ value: 'Overlay Simple', selector: '.ugb-team-member--design-overlay-simple' },
		{ value: 'Half', selector: '.ugb-team-member--design-half' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/team-member', [
		'Capital Team Member',
		'Cary Team Member 1',
		'Cary Team Member 2',
		'Decora Team Member',
		'Detour Team Member',
		'Dim Team Member',
		'Elevate Team Member',
		'Glow Team Member',
		'Heights Team Member',
		'Hue Team Member',
		'Lume Team Member',
		'Lush Team Member',
		'Prime Team Member',
		'Seren Team Member 1',
		'Seren Team Member 2',
		'Upland Team Member',
	] ) )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/team-member' ).as( 'teamMemberBlock' )
	const teamMemberBlock = registerBlockSnapshots( 'teamMemberBlock' )
	cy.openInspector( 'ugb/team-member', 'Style' )

	// General Tab
	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Columns', 3 )
		cy.get( '.ugb-team-member__item3' ).should( 'exist' )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Container Tab
	cy.collapse( 'Container' )

	assertContainer( '.ugb-team-member__item', { viewport }, 'column%sBackgroundMediaUrl' )

	range( 1, 4 ).forEach( idx => {
		cy.setBlockAttribute( {
			[ `image${ idx }Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
	} )

	// Spacing Tab
	cy.collapse( 'Spacing' )

	cy.adjust( 'Paddings', 30, { viewport } ).assertComputedStyle( {
		'.ugb-team-member__item': {
			'padding-top': '30px',
			'padding-bottom': '30px',
			'padding-right': '30px',
			'padding-left': '30px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-team-member__item': {
			'padding-top': '5em',
			'padding-bottom': '5em',
			'padding-right': '5em',
			'padding-left': '5em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 25, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-team-member__item': {
			'padding-top': '25%',
			'padding-bottom': '25%',
			'padding-right': '25%',
			'padding-left': '25%',
		},
	} )

	cy.adjust( 'Image', 3, { viewport } )
	cy.adjust( 'Name', 8, { viewport } )
	cy.adjust( 'Position', 13, { viewport } )
	cy.adjust( 'Description', 18, { viewport } )
	cy.adjust( 'Social', 13, { viewport } )
	cy.adjust( 'Social Button Gap', 10, { viewport } )
		.assertComputedStyle( {
			'.ugb-team-member__image': {
				'margin-bottom': '3px',
			},
			'.ugb-team-member__name': {
				'margin-bottom': '8px',
			},
			'.ugb-team-member__position': {
				'margin-bottom': '13px',
			},
			'.ugb-team-member__description': {
				'margin-bottom': '18px',
			},
			'.ugb-button-container': {
				'margin-bottom': '13px',
			},
			'.ugb-button': {
				'margin-left': '10px',
				'margin-right': '10px',
			},
		} )

	// Image Tab
	cy.collapse( 'Image' )

	desktopOnly( () => {
		cy.adjust( 'Shape', {
			label: 'Blob 1',
			value: 'blob1',
		} )
		cy.adjust( 'Flip Shape Horizontally', true )
		cy.adjust( 'Flip Shape Vertically', true )
		cy.adjust( 'Stretch Shape Mask', true ).assertClassName( 'img.ugb-img--shape', 'ugb-image--shape-stretch' )

		// We won't be able to assert image size for now since it requires server handling.
	} )

	cy.adjust( 'Image Width', 300, { viewport } )
	cy.adjust( 'Force square image', true, { viewport } ).assertComputedStyle( {
		'.ugb-img': {
			'width': '300px',
			'height': '300px',
		},
	} )

	// TO DO: Make assert align for image

	// Name, Position and Description Tabs
	const typographyAssertions = [ 'name', 'position', 'description' ]
	typographyAssertions.forEach( typographyAssertion => {
		const label = startCase( typographyAssertion )
		cy.collapse( label )
		if ( typographyAssertion === 'name' ) {
			desktopOnly( () => {
				cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-team-member__name', 'h4' )
			} )
		}

		desktopOnly( () => {
			cy.adjust( `${ label } Color`, '#742f2f' ).assertComputedStyle( {
				[ `.ugb-team-member__${ typographyAssertion }` ]: {
					'color': '#742f2f',
				},
			} )
		} )

		cy.adjust( 'Size', 55, { viewport, unit: 'px' } ).assertComputedStyle( {
			[ `.ugb-team-member__${ typographyAssertion }` ]: {
				'font-size': '55px',
			},
		} )
		cy.adjust( 'Size', 2, { viewport, unit: 'em' } ).assertComputedStyle( {

			[ `.ugb-team-member__${ typographyAssertion }` ]: {
				'font-size': '2em',
			},
		} )

		assertTypography( `.ugb-team-member__${ typographyAssertion }`, { viewport } )
		assertAligns( 'Align', `.ugb-team-member__${ typographyAssertion }`, { viewport } )
	} )

	// Social Tab
	cy.collapse( 'Social' )

	cy.adjust( 'Pinterest', true )
	cy.adjust( 'LinkedIn', true )
	cy.adjust( 'YouTube', true )

	teamMemberBlock.assertFrontendStyles()
}

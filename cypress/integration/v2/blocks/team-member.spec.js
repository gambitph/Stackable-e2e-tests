/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { range } from 'lodash'

const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )
describe( 'Team Member Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
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

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/team-member' ).as( 'teamMemberBlock' )
	const teamMemberBlock = registerBlockSnapshots( 'teamMemberBlock' )

	cy.openInspector( 'ugb/team-member', 'Advanced' )

	assertAdvancedTab( '.ugb-team-member', { viewport } )

	desktopOnly( () => {
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		range( 1, 3 ).forEach( idx => {
			cy.collapse( `Column #${ idx }` )
			cy.adjust( 'Column Background', '#a03b3b' ).assertComputedStyle( {
				[ `.ugb-team-member__item${ idx }` ]: {
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
			cy.adjust( 'Stretch Shape Mask', true ).assertClassName( `.ugb-team-member__item${ idx } img.ugb-img--shape`, 'ugb-image--shape-stretch' )
		} )
	} )
	teamMemberBlock.assertFrontendStyles()
}

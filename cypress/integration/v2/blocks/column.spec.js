/**
 * External dependencies
 */
import {
	registerTests, responsiveAssertHelper, assertAdvancedTab, assertAligns, assertContainer, assertContainerLink,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ columnDesktopStyle, columnTabletStyle, columnMobileStyle ] = responsiveAssertHelper( columnStyleTab )
const [ columnDesktopAdvanced, columnTabletAdvanced, columnMobileAdvanced ] = responsiveAssertHelper( columnAdvancedTab, { tab: 'Advanced' } )

describe( 'Advanced Columns and Grid Block', registerTests( [
	switchColumnLayout,
	columnDesktopStyle,
	columnTabletStyle,
	columnMobileStyle,
	columnDesktopAdvanced,
	columnTabletAdvanced,
	columnMobileAdvanced,
] ) )

function switchColumnLayout() {
	it( 'should switch column layout', () => {
		cy.setupWP()
		cy.newPage()

		const layouts = [
			{ value: 'Basic', selector: '.ugb-column--design-basic' },
			{ value: 'Plain', selector: '.ugb-column--design-plain' },
		]

		layouts.forEach( layout => {
			cy.addBlock( 'ugb/columns' )
			cy.openInspector( 'ugb/column', 'Layout' )
			const { value, selector } = layout
			cy.adjustLayout( value )
			cy.get( selector ).should( 'exist' )
			cy.deleteBlock( 'ugb/columns' )
		} )
		cy.savePost()
	} )
}

function columnStyleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' )
	cy.selectBlock( 'ugb/column' ).as( 'columnBlock' )
	const columnBlock = registerBlockSnapshots( 'columnBlock' )

	cy.openInspector( 'ugb/column', 'Layout', '@columnBlock' )
	cy.adjustLayout( 'Basic' )
	cy.openInspector( 'ugb/column', 'Style', '@columnBlock' )
	cy.collapse( 'General' )

	const aligns = [ 'flex-start', 'center', 'flex-end' ]
	aligns.forEach( align => {
		cy.adjust( 'Content Vertical Align', align, { viewport } ).assertComputedStyle( {
			'.ugb-column__item': {
				'justify-content': align,
			},
		} )
	} )
	cy.adjust( 'Content Width', 73, { unit: '%', viewport } ).assertComputedStyle( {
		'.ugb-column__content-wrapper': {
			'width': '73%',
		},
	} )
	cy.adjust( 'Content Width', 159, { unit: 'px', viewport } ).assertComputedStyle( {
		'.ugb-column__content-wrapper': {
			'width': '159px',
		},
	} )
	aligns.forEach( align => {
		cy.adjust( 'Content Width', 73, { viewport } )
		cy.adjust( 'Content Horizontal Align', align, { viewport } ).assertComputedStyle( {
			'.ugb-column__item': {
				'align-items': align,
			},
		} )
	} )
	assertAligns( 'Align', '.ugb-column .ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )
	assertContainer( '.ugb-column__item', { viewport }, 'column%sBackgroundMediaUrl' )

	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-column__item': {
			'padding-top': '25px',
			'padding-right': '26px',
			'padding-bottom': '27px',
			'padding-left': '28px',
		},
	} )
	cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { unit: 'em', viewport } ).assertComputedStyle( {
		'.ugb-column__item': {
			'padding-top': '3em',
			'padding-right': '4em',
			'padding-bottom': '5em',
			'padding-left': '6em',
		},
	} )
	cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { unit: '%', viewport } ).assertComputedStyle( {
		'.ugb-column__item': {
			'padding-top': '17%',
			'padding-right': '18%',
			'padding-bottom': '19%',
			'padding-left': '20%',
		},
	} )

	desktopOnly( () => {
		// Set the text colors in ugb/column
		cy.collapse( 'Text Colors' )
		cy.adjust( 'Heading Color', '#8e8ee0' )
		cy.adjust( 'Text Color', '#24b267' )
		cy.adjust( 'Link Color', '#642c2c' )
		cy.adjust( 'Link Hover Color', '#ba89df' )

		// Add a ugb/card block inside the column
		cy.addInnerBlock( 'ugb/column', 'ugb/card', '@columnBlock' )
		cy.openInspector( 'ugb/card', 'Style' )
		cy.collapse( 'Button' )
		cy.adjust( 'Design', 'link' ).assertComputedStyle( {
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

		// Go back to ugb/column
		cy.selectBlock( 'ugb/column', '@columnBlock' )
	} )
	assertContainerLink( '.ugb-column__item', { viewport } )
	columnBlock.assertFrontendStyles()
}

function columnAdvancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' )
	cy.selectBlock( 'ugb/column' ).as( 'columnBlock' )
	const columnBlock = registerBlockSnapshots( 'columnBlock' )

	cy.addInnerBlock( 'ugb/column', 'ugb/card', '@columnBlock' )
	cy.openInspector( 'ugb/column', 'Advanced', '@columnBlock' )
	assertAdvancedTab( '.ugb-column', { viewport } )
	columnBlock.assertFrontendStyles()
}

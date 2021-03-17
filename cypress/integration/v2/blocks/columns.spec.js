/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertContainer,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )
const [ columnDesktopStyle, columnTabletStyle, columnMobileStyle ] = responsiveAssertHelper( columnStyleTab )
const [ columnDesktopAdvanced, columnTabletAdvanced, columnMobileAdvanced ] = responsiveAssertHelper( columnAdvancedTab, { tab: 'Advanced' } )

describe( 'Advanced Columns and Grid Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
	switchColumnLayout,
	columnDesktopStyle,
	columnTabletStyle,
	columnMobileStyle,
	columnDesktopAdvanced,
	columnTabletAdvanced,
	columnMobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/columns', '.ugb-columns' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/columns' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks inside Advanced Columns and Grid', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/columns' )

		blocks
			.filter( blockName => blockName !== 'ugb/columns' )
			.forEach( blockName => cy.addInnerBlock( 'ugb/columns', blockName ) )

		cy.publish()
	} )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/columns', [
		{ value: 'Grid', selector: '.ugb-columns--design-grid' },
		{ value: 'Plain', selector: '.ugb-columns--design-plain' },
		{ value: 'Uneven', selector: '.ugb-columns--design-uneven' },
		{ value: 'Uneven 2', selector: '.ugb-columns--design-uneven-2' },
		{ value: 'Tiled', selector: '.ugb-columns--design-tiled' },
	] ) )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' ).as( 'columnsBlock' )
	const columnsBlock = registerBlockSnapshots( 'columnsBlock' )
	cy.openInspector( 'ugb/columns', 'Style' )

	cy.collapse( 'General' )

	desktopOnly( () => {
		range( 2, 7 ).forEach( idx => {
			cy.adjust( 'Columns', idx )
			cy
				.get( '.ugb-columns' )
				.find( '.ugb-column' )
				.should( 'have.length', idx )
		} )
		// TODO: Column Arrangement
	} )
	cy.adjust( 'Columns', 2 )

	if ( viewport !== 'Mobile' ) {
		cy.adjust( 'Column Widths', [ 67, 33 ], { viewport } ).assertComputedStyle( {
			'.ugb-columns__item': {
				'grid-template-columns': '1.34fr 0.66fr',
			},
		}, {
			assertFrontend: false,
		} )
	}

	cy.adjust( 'Column Gap', 115, { viewport } ).assertComputedStyle( {
		'.ugb-columns__item': {
			'grid-column-gap': '115px',
		},
	} )

	cy.adjust( 'Height', 'half', { viewport } ).assertComputedStyle( {
		'.ugb-columns__item': {
			'min-height': '50vh',
		},
	} )

	cy.adjust( 'Height', 'full', { viewport } ).assertComputedStyle( {
		'.ugb-columns__item': {
			'min-height': '100vh',
		},
	} )

	cy.adjust( 'Height', 'custom', { viewport } )
	cy.adjust( 'Custom Height', 220, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-columns__item': {
			'min-height': '220px',
		},
	} )
	cy.adjust( 'Height', 'custom', { viewport } )
	cy.adjust( 'Custom Height', 31, { viewport, unit: 'vh' } ).assertComputedStyle( {
		'.ugb-columns__item': {
			'min-height': '31vh',
		},
	} )

	const aligns = [ 'flex-start', 'center', 'flex-end', 'stretch' ]
	aligns.forEach( align => {
		cy.adjust( 'Column Vertical Align', align, { viewport } ).assertComputedStyle( {
			'.ugb-columns__item .wp-block': {
				'justify-content': align,
			},
		}, {
			assertFrontend: false,
		} )
	} )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	desktopOnly( () => {
		// Set the text colors in ugb/columns
		cy.collapse( 'Text Colors' )
		cy.adjust( 'Heading Color', '#8e8ee0' )
		cy.adjust( 'Text Color', '#24b267' )
		cy.adjust( 'Link Color', '#642c2c' )
		cy.adjust( 'Link Hover Color', '#ba89df' )

		// Add a ugb/card block inside the first column
		cy.addInnerBlock( 'ugb/column', 'ugb/card' )
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

		// Go back to ugb/columns
		cy.selectBlock( 'ugb/columns' )
	} )

	assertBlockTitleDescription( { viewport, enableSpacing: false } )
	assertBlockBackground( '.ugb-columns', { viewport } )
	assertSeparators( { viewport } )

	columnsBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' ).as( 'columnsBlock' )
	const columnsBlock = registerBlockSnapshots( 'columnsBlock' )

	cy.openInspector( 'ugb/columns', 'Advanced' )

	assertAdvancedTab( '.ugb-columns', {
		viewport,
		customCssSelectors: [
			'.ugb-columns__item',
		],
	} )
	desktopOnly( () => {
		cy.collapse( 'Responsive' )
		cy.adjust( 'Collapsed Row Gap', 500 ).assertComputedStyle( {
			'.ugb-columns__item': {
				'grid-row-gap': '500',
			},
		}, {
			assertBackend: false,
			viewportFrontend: 'Mobile',
		} )
		// TODO: Collapsed Col. Arrangement
	} )

	// Add more block specific tests.
	columnsBlock.assertFrontendStyles()
}

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
	} )
}

function columnStyleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' )

	cy.openInspector( 'ugb/column', 'Layout' )
	cy.adjustLayout( 'Basic' )
	cy.openInspector( 'ugb/column', 'Style' )
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
	cy.adjust( 'Paddings', 28, { unit: 'px', viewport } ).assertComputedStyle( {
		'.ugb-column__item': {
			'padding-top': '28px',
			'padding-bottom': '28px',
			'padding-right': '28px',
			'padding-left': '28px',
		},
	} )
	cy.adjust( 'Paddings', 7, { unit: 'em', viewport } ).assertComputedStyle( {
		'.ugb-column__item': {
			'padding-top': '7em',
			'padding-bottom': '7em',
			'padding-right': '7em',
			'padding-left': '7em',
		},
	} )
	cy.adjust( 'Paddings', 23, { unit: '%', viewport } ).assertComputedStyle( {
		'.ugb-column__item': {
			'padding-top': '23%',
			'padding-bottom': '23%',
			'padding-right': '23%',
			'padding-left': '23%',
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
		cy.addInnerBlock( 'ugb/column', 'ugb/card' )
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
		cy.selectBlock( 'ugb/column' )
	} )
}

function columnAdvancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' )

	cy.addInnerBlock( 'ugb/column', 'ugb/card' )
	cy.openInspector( 'ugb/column', 'Advanced' )
	assertAdvancedTab( '.ugb-column', { viewport } )
}

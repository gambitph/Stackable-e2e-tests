/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAdvancedTab, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Advanced Columns and Grid Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
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

		cy.savePost()
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/columns' ).as( 'columnsBlock' )
		registerBlockSnapshots( 'columnsBlock' )
		cy.openInspector( 'ugb/columns', 'Style' )

		assertBlockTitleDescriptionContent( 'ugb/columns' )
	} )
}

function styleTab( viewport, desktopOnly ) {
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
				'grid-template-columns': `${ viewport === 'Desktop' ? '1.34fr 0.66fr' : '1.14fr 0.66fr' }`,
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

function advancedTab( viewport, desktopOnly ) {
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

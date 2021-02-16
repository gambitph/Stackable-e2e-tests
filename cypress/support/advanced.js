/**
 * External dependencies
 */
import {
	keys, compact,
} from 'lodash'

/**
 *
 * Assertion function for Advanced Tab.
 *
 * @param {string} name
 * @param {Object} options
 * @param {Function} desktopCallback
 * @param {Function} tabletCallback
 * @param {Function} mobileCallback
 */
export const assertAdvancedTab = ( name, options = {}, desktopCallback = () => {}, tabletCallback = () => {}, mobileCallback = {} ) => {
	const {
		enableMarginTop = true,
		enableMarginRight = true,
		enableMarginBottom = true,
		enableMarginLeft = true,
		enablePaddingTop = true,
		enablePaddingRight = true,
		enablePaddingBottom = true,
		enablePaddingLeft = true,
	} = options

	const MAIN_SELECTOR = '.ugb-main-block'
	const BLOCK_SELECTOR = `.${ name.split( '/' ).join( '-' ) }`

	const callbacks = {
		Desktop: desktopCallback,
		Tablet: tabletCallback,
		Mobile: mobileCallback,
	}

	const _collapse = ( collapseName = '' ) => {
		cy.get( '.ugb-inspector-panel-controls', { log: false } )
			.then( $panel => {
				if ( $panel.text().includes( collapseName ) ) {
					cy.collapse( collapseName )
				}
			} )
	}

	const _adjust = ( adjustName, value, options = {}, assertionFunc, args = [] ) => {
		cy.get( '.ugb-toggle-panel-body.is-opened', { log: false } )
			.then( $panel => {
				if ( $panel.text().includes( adjustName ) ) {
					if ( args.length ) {
						cy.adjust( adjustName, value, options )[ assertionFunc ]( ...args )
					} else {
						cy.adjust( adjustName, value, options )
					}
				}
			} )
	}

	const _assertAdvancedTab = ( viewport = 'Desktop' ) => {
		cy.openInspector( name, 'Advanced' )
		_collapse( 'General' )

		// Test Block HTML Tag
		const tags = [ 'div', 'blockquote', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav', 'address', 'hgroup' ]
		tags.forEach( tag => {
			_adjust( 'Block HTML Tag', tag, { viewport }, 'assertHtmlTag', [
				MAIN_SELECTOR,
				tag,
			] )
		} )

		// Test Opacity
		_adjust( 'Opacity', 0.7, { viewport }, 'assertComputedStyle', [ {
			[ MAIN_SELECTOR ]: {
				'opacity': '0.7',
			},
		} ] )

		// Test Z-index
		_adjust( 'Z-index', 6, { viewport }, 'assertComputedStyle', [ {
			[ MAIN_SELECTOR ]: {
				'z-index': '6',
			},
		} ] )

		_collapse( 'Block Spacing' )

		// Test Min. Block Height.
		_adjust( 'Min. Block Height', 850, { viewport }, 'assertComputedStyle', [ {
			[ BLOCK_SELECTOR ]: {
				'min-height': '850px',
			},
		} ] )
		_adjust( 'Min. Block Height', 87, { viewport, unit: 'vh' }, 'assertComputedStyle', [ {
			[ BLOCK_SELECTOR ]: {
				'min-height': '87vh',
			},
		} ] )

		// Test Content Vertical Align.
		const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
		verticalAligns.forEach( align => {
			_adjust( 'Content Vertical Align', align, { viewport }, 'assertComputedStyle', [ {
				[ BLOCK_SELECTOR ]: {
					'align-items': align,
				},
			} ] )
		} )

		// Test Max Content Width.
		_adjust( 'Max Content Width', 2303, { viewport }, 'assertComputedStyle', [ {
			'.ugb-inner-block': {
				'max-width': '2303px',
			},
		} ] )
		_adjust( 'Max Content Width', 78, { viewport, unit: '%' }, 'assertComputedStyle', [ {
			'.ugb-inner-block': {
				'max-width': '78%',
			},
		} ] )

		// Test Content Horizontal Align.
		const horizontalAlign = [ 'flex-start', 'center', 'flex-end' ]
		horizontalAlign.forEach( align => {
			_adjust( 'Content Horizontal Align', align, { viewport }, 'assertComputedStyle', [ {
				[ BLOCK_SELECTOR ]: {
					'justify-content': align,
				},
			} ] )
		} )

		const generateFourRangeControlAssertion = ( top, right, bottom, left, values = [], template = 'margin', unit = 'px' ) => {
			const aligns = [ 'top', 'right', 'bottom', 'left' ]
			const conditions = {
				top, right, bottom, left,
			}
			const fourRangeControl = {}
			const asserts = {}

			aligns.forEach( ( align, index ) => {
				fourRangeControl[ align ] = conditions[ align ] && values[ index ]
				if ( conditions[ align ] ) {
					asserts[ `${ template }-${ align }` ] = `${ values[ index ] }${ unit }`
				}
			} )

			return [ compact( keys( fourRangeControl ).map( k => fourRangeControl[ k ] ) ), asserts ]
		}

		const units = [ 'em', 'px', '%' ]
		units.forEach( unit => {
			const values = unit === 'em' ? [ 3, 2, 1, 2 ] : [ 12, 65, 34, 23 ]
			if ( unit !== 'em' ) {
				// Test Block Margins.
				const [ margins, marginAsserts ] = generateFourRangeControlAssertion(
					enableMarginTop,
					enableMarginRight,
					enableMarginBottom,
					enableMarginLeft,
					values,
					'margin',
					unit
				)

				_adjust( 'Block Margins', margins, { unit, viewport }, 'assertComputedStyle', [ { [ BLOCK_SELECTOR ]: marginAsserts } ] )
			}

			// Test Block Paddings.
			const [ paddings, paddingAsserts ] = generateFourRangeControlAssertion(
				enablePaddingTop,
				enablePaddingRight,
				enablePaddingBottom,
				enablePaddingLeft,
				values,
				'padding',
				unit
			)

			_adjust( 'Block Paddings', paddings, { unit, viewport }, 'assertComputedStyle', [ { [ BLOCK_SELECTOR ]: paddingAsserts } ] )
		} )

		_collapse( 'Column / Container Spacing' )

		// Test Column Gap.
		_adjust( 'Column Gap', 24, { viewport }, 'assertComputedStyle', [ {
			'.ugb-block-content': {
				'column-gap': '24px',
			},
		} ] )

		// Test Column Vertical Align.
		const columnVerticalAligns = [ 'flex-start', 'center', 'flex-end', 'stretch' ]
		columnVerticalAligns.forEach( align => {
			_adjust( 'Column Vertical Align', align, { viewport }, 'assertComputedStyle', [ {
				'.ugb-block-content': {
					'align-items': align,
				},
			} ] )
		} )

		// Test Min. Column Height.
		_adjust( 'Min. Column Height', 161, { viewport }, 'assertComputedStyle', [ {
			'.ugb-block-content>*': {
				'min-height': '161px',
			},
		} ] )

		// Test Content Vertical Align.
		const contentVerticalAligns = [ 'flex-start', 'center', 'flex-end' ]
		contentVerticalAligns.forEach( align => {
			_adjust( 'Content Vertical Align', align, { viewport }, 'assertComputedStyle', [ {
				'.ugb-block-content>*': {
					'justify-content': align,
				},
			} ] )
		} )
		callbacks[ viewport ]()
	}

	return () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( name )
		const previewMode = [ 'Desktop', 'Tablet', 'Mobile' ]

		previewMode.forEach( preview => {
			_assertAdvancedTab( preview )
		} )

		_collapse( 'Responsive' )

		previewMode.forEach( preview => {
			_adjust( `Hide on ${ preview }`, true, {}, 'assertComputedStyle', [ {
				[ MAIN_SELECTOR ]: {
					'display': 'none',
				},
			}, {
				assertBackend: false,
				viewportFrontend: preview,
			} ] )
		} )

		// TODO: Custom CSS
		// TODO: HTML Anchor
		// TODO: Additional CSS class(es)
	}
}


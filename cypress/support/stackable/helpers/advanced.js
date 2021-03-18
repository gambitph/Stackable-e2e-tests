/**
 * External dependencies
 */
import {
	keys, compact, lowerCase,
} from 'lodash'

/**
 *
 * Assertion function for Advanced Tab.
 *
 * @param {string} selector
 * @param {Object} options
 */
export const assertAdvancedTab = ( selector, options = {} ) => {
	const {
		disableColumnHeight = false,
		disableColumnVerticalAlign = false,
		disableBlockMargins = false,
		disableBlockPaddings = false,
		enableMarginTop = true,
		enableMarginRight = true,
		enableMarginBottom = true,
		enableMarginLeft = true,
		enablePaddingTop = true,
		enablePaddingRight = true,
		enablePaddingBottom = true,
		enablePaddingLeft = true,
		paddingUnits = [ 'px', 'em', '%' ],
		marginUnits = [ 'px', '%' ],
		verticalAlignSelector = null,
		customCssSelectors = [],
		viewport = 'Desktop',
		mainSelector = null,
	} = options

	const MAIN_SELECTOR = mainSelector || '.ugb-main-block'
	selector = mainSelector || selector

	/**
	 * Only collapse when present.
	 *
	 * @param {string} collapseName
	 * @param {Function} callback
	 */
	const _collapse = ( collapseName = '', callback = () => {} ) => {
		const customSelector = {
			'Advanced': 'block-editor-block-inspector__advanced',
		}

		cy.get( `.${ customSelector[ collapseName ] || 'ugb-inspector-panel-controls' }` )
			.then( $panel => {
				if ( $panel.text().includes( collapseName ) ) {
					cy.collapse( collapseName )
					callback()
				}
			} )
	}

	/**
	 * Only adjust when present.
	 *
	 * @param {name} adjustName
	 * @param {*} value
	 * @param {Object} options
	 * @param {string} assertionFunc
	 * @param {Array} args
	 */
	const _adjust = ( adjustName, value, options = {}, assertionFunc, ...args ) => {
		cy.get( '.components-panel__body.is-opened' )
			.then( $panel => {
				if ( $panel.text().includes( adjustName ) ) {
					if ( args.length ) {
						cy.adjust( adjustName, value, options )[ assertionFunc ]( ... args )
					} else {
						cy.adjust( adjustName, value, options )
					}
				}
			} )
	}

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

	const _assertAdvancedTab = ( viewport = 'Desktop' ) => {
		_collapse( 'General', () => {
			// Test Block HTML Tag
			if ( viewport === 'Desktop' ) {
				const tags = [ 'div', 'blockquote', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav', 'address', 'hgroup' ]
				tags.forEach( tag => {
					_adjust( 'Block HTML Tag', tag, { viewport }, 'assertHtmlTag', MAIN_SELECTOR,
						tag )
				} )
			}

			// Test Opacity
			_adjust( 'Opacity', 0.7, { viewport }, 'assertComputedStyle', {
				[ MAIN_SELECTOR ]: {
					'opacity': '0.7',
				},
			} )

			// Test Z-index
			_adjust( 'Z-Index', 6, { viewport }, 'assertComputedStyle', {
				[ MAIN_SELECTOR ]: {
					'z-index': '6',
				},
			} )
		} )

		_collapse( 'Block Spacing', () => {
			// Test Min. Block Height.
			_adjust( 'Min. Block Height', 850, { viewport }, 'assertComputedStyle', {
				[ selector ]: {
					'min-height': '850px',
				},
			} )
			_adjust( 'Min. Block Height', 87, { viewport, unit: 'vh' }, 'assertComputedStyle', {
				[ selector ]: {
					'min-height': '87vh',
				},
			} )

			// Test Content Vertical Align.
			const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
			verticalAligns.forEach( align => {
				_adjust( 'Content Vertical Align', align, { viewport }, 'assertComputedStyle', {
					[ selector ]: {
						'align-items': align,
					},
				} )
			} )

			// Test Max Content Width.
			_adjust( 'Max Content Width', 2303, { viewport }, 'assertComputedStyle', {
				'.ugb-inner-block': {
					'max-width': '2303px',
				},
			} )
			_adjust( 'Max Content Width', 78, { viewport, unit: '%' }, 'assertComputedStyle', {
				'.ugb-inner-block': {
					'max-width': '78%',
				},
			} )

			// Test Content Horizontal Align.
			const horizontalAlign = [ 'flex-start', 'center', 'flex-end' ]
			horizontalAlign.forEach( align => {
				_adjust( 'Content Horizontal Align', align, { viewport }, 'assertComputedStyle', {
					[ selector ]: {
						'justify-content': align,
					},
				} )
			} )

			if ( ! disableBlockMargins ) {
				marginUnits.forEach( unit => {
					const values = [ 12, 65, 34, 23 ]
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

					_adjust( 'Block Margins', margins, { unit, viewport }, 'assertComputedStyle', { [ selector ]: marginAsserts } )
				} )
			}

			if ( ! disableBlockPaddings ) {
				paddingUnits.forEach( unit => {
					const values = unit === 'em' ? [ 3, 2, 1, 2 ] : [ 12, 65, 34, 23 ]
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

					_adjust( 'Block Paddings', paddings, { unit, viewport }, 'assertComputedStyle', { [ selector ]: paddingAsserts } )
				} )
			}
		} )

		_collapse( 'Column / Container Spacing', () => {
			// Test Column Gap.
			_adjust( 'Column Gap', 24, { viewport }, 'assertComputedStyle', {
				'.ugb-block-content': {
					'column-gap': '24px',
				},
			} )

			// Test Column Vertical Align.
			if ( ! disableColumnVerticalAlign ) {
				const columnVerticalAligns = [ 'flex-start', 'center', 'flex-end', 'stretch' ]
				columnVerticalAligns.forEach( align => {
					_adjust( 'Column Vertical Align', align, { viewport }, 'assertComputedStyle', {
						'.ugb-block-content': {
							'align-items': align,
						},
					} )
				} )
			}

			// Test Min. Column Height.
			if ( ! disableColumnHeight ) {
				_adjust( 'Min. Column Height', 161, { viewport }, 'assertComputedStyle', {
					'.ugb-block-content>*': {
						'min-height': '161px',
					},
				} )
			}

			// Test Content Vertical Align.
			const contentVerticalAligns = [ 'flex-start', 'center', 'flex-end' ]
			contentVerticalAligns.forEach( align => {
				_adjust( 'Content Vertical Align', align, { viewport }, 'assertComputedStyle', {
					[ verticalAlignSelector || '.ugb-block-content>*' ]: {
						'justify-content': align,
					},
				} )
			} )
		} )

		_collapse( 'Custom CSS', () => {
			//Test Custom CSS
			if ( viewport === 'Desktop' ) {
				const assertionObj = {}
				let customCssString = ''
				customCssSelectors.unshift( '' )
				customCssSelectors.forEach( cssSelector => {
					customCssString += `
					${ `${ selector } ${ cssSelector }` } {
						color: #808080;
					}
				`
					assertionObj[ `${ selector } ${ cssSelector }` ] = { 'color': '#808080' }
				} )

				cy.setBlockAttribute( {
					'customCSS': customCssString,
				} )
				cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( assertionObj )
			}
		} )

		_collapse( 'Advanced', () => {
			if ( viewport === 'Desktop' ) {
				// Test HTML anchor
				_adjust( 'HTML anchor', 'e2e-html-anchor', { viewport }, 'assertHtmlAttribute', selector, 'id', 'e2e-html-anchor' )
			}
		} )
	}

	_assertAdvancedTab( viewport )

	_collapse( 'Responsive' )

	_adjust( `Hide on ${ viewport }`, true, {}, 'assertClassName', MAIN_SELECTOR, `ugb--hide-${ lowerCase( viewport ) }` )
}


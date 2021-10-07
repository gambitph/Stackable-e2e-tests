/**
 * External dependencies
 */
import {
	keys, compact, lowerCase,
} from 'lodash'

/**
 * Internal dependencies
 */
import { Module } from './internals'

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

		if ( viewport === 'Desktop' ) {
			// Test Custom Attributes
			_collapse( 'Custom Attributes', () => {
				_adjust( 'Custom Attributes', 'data-type="some-text"', { viewport }, 'assertHtmlAttribute', selector, 'data-type', 'some-text' )
				_adjust( 'Custom Attributes', 'data-type="some-text" aria-label="block"', { viewport }, 'assertHtmlAttribute', selector, 'aria-label', 'block' )
				_adjust( 'Custom Attributes', 'data-type="some-text" aria-label="block" data-title="title123"', { viewport }, 'assertHtmlAttribute', selector, 'data-title', 'title123' )
			} )

			//Test Custom CSS
			_collapse( 'Custom CSS', () => {
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
			} )
		}

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
class AdvancedModule extends Module {
	constructor() {
		super()
		this.registerTest( 'General', this.assertGeneral )
		this.registerTest( 'Position', this.assertPosition )
		this.registerTest( 'Transform & Transition', this.assertTransformTransition )
		this.registerTest( 'Motion Effects', this.assertMotionEffects )
		this.registerTest( 'Custom Attributes', this.assertCustomAttributes )
		this.registerTest( 'Custom CSS', this.assertCustomCSS )
		this.registerTest( 'Responsive', this.assertResponsive )
		this.registerTest( 'Conditional Display', this.assertConditionalDisplay )
		this.registerTest( 'Advanced', this.assertAdvanced )
		this.setModuleName( 'Advanced Tab' )
	}

	assertGeneral( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		if ( viewport === 'Desktop' ) {
			const tags = [ 'address', 'article', 'aside', 'blockquote', 'div', 'details', 'footer', 'header', 'hgroup', 'main', 'nav', 'section', 'summary' ]
			tags.forEach( tag => {
				cy.adjust( 'Block HTML Tag', tag ).assertHtmlTag( MAIN_SELECTOR, tag )
			} )

			const clear = [ 'left', 'right', 'both', 'none' ]
			clear.forEach( value => {
				cy.adjust( 'Clear', value ).assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'clear': value,
					},
				} )
			} )
		}

		const overflow = [ 'auto', 'hidden', 'scroll', 'visible' ]
		overflow.forEach( value => {
			cy.adjust( 'Overflow', value, { viewport } ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'overflow': value,
				},
			} )
		} )
	}

	assertPosition( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		cy.adjust( 'Opacity', 0.6, { viewport, state: 'hover' } ).assertComputedStyle( {
			[ `${ MAIN_SELECTOR }:hover` ]: {
				'opacity': '0.6',
			},
		} )

		cy.adjust( 'Opacity', 0.8, { viewport, state: 'normal' } ).assertComputedStyle( {
			[ MAIN_SELECTOR ]: {
				'opacity': '0.8',
			},
		} )

		cy.adjust( 'Z-Index', 7, { viewport } ).assertComputedStyle( {
			'': { // assert the .is-selected element in editor
				'z-index': '7',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ MAIN_SELECTOR ]: {
				'z-index': '7',
			},
		}, { assertBackend: false } )

		const positions = [ 'static', 'relative', 'absolute', 'sticky' ]
		positions.forEach( value => {
			cy.adjust( 'Position', value, { viewport } ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'position': value,
				},
			} )
		} )

		// TODO: There are 2 `Position` options. This part may fail.
		// Hover state - px unit
		cy.adjust( 'Position', [ 16, 17, 18, 19 ], {
			viewport, state: 'hover', unit: 'px',
		} ).assertComputedStyle( {
			[ `${ MAIN_SELECTOR }:hover` ]: {
				'top': '16px',
				'right': '17px',
				'bottom': '18px',
				'left': '19px',
			},
		} )

		// Hover state - % unit
		cy.adjust( 'Position', [ 20, 21, 22, 23 ], {
			viewport, state: 'hover', unit: '%',
		} ).assertComputedStyle( {
			[ `${ MAIN_SELECTOR }:hover` ]: {
				'top': '20%',
				'right': '21%',
				'bottom': '22%',
				'left': '23%',
			},
		} )

		// Normal state - px unit
		cy.adjust( 'Position', [ 5, 4, 3, 2 ], {
			viewport, state: 'normal', unit: 'px',
		} ).assertComputedStyle( {
			[ MAIN_SELECTOR ]: {
				'top': '5px',
				'right': '4px',
				'bottom': '3px',
				'left': '2px',
			},
		} )

		// Normal state - % unit
		cy.adjust( 'Position', [ 23, 24, 25, 26 ], {
			viewport, state: 'normal', unit: '%',
		} ).assertComputedStyle( {
			[ MAIN_SELECTOR ]: {
				'top': '23%',
				'right': '24%',
				'bottom': '25%',
				'left': '26%',
			},
		} )
	}

	assertTransformTransition( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Transition Duration (secs)', 1.14 ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'transition-duration': '1.14',
				},
			} )

			const transitions = [
				'ease',
				'ease-in',
				'ease-out',
				'ease-in-out',
				'linear',
				'cubic-bezier(0.11, 0, 0.5, 0)',
				'cubic-bezier(0.5, 1, 0.89, 1)',
				'cubic-bezier(0.45, 0, 0.55, 1)',
				'cubic-bezier(0.7, 0, 0.84, 0)',
				'cubic-bezier(0.16, 1, 0.3, 1)',
				'cubic-bezier(0.87, 0, 0.13, 1)',
				'cubic-bezier(0.36, 0, 0.66, -0.56)',
				'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
			]
			transitions.forEach( value => {
				cy.adjust( 'Transition Function', value ).assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'transition-timing-function': value,
					},
				} )
			} )

			const transformOrigin = [ 'top left', 'top center', 'top center', 'center left', 'center center', 'center right', 'bottom left', 'bottom center', 'bottom right' ]
			transformOrigin.forEach( value => {
				cy.adjust( 'Transform Origin', value ).assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'transform-origin': value,
					},
				} )
			} )
		}

		// TODO: support null values in Stackable overwrite commands -> only to change the viewport & state controls
		cy.adjust( 'Transform', null, { viewport, state: 'normal' } )
		cy.adjust( 'Translate X', 21, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Translate Y', 16, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Rotate', 14.3, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Scale', 0.89, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
			.assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'transform': 'translateX(21px) translateY(16px) rotate(14.3deg) scale(0.89)',
				},
			} )

		// TODO: support null values in Stackable overwrite commands -> only to change the viewport & state controls
		cy.adjust( 'Transform', null, { viewport, state: 'hover' } )
		cy.adjust( 'Translate X', '-40', { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Translate Y', '-23', { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Rotate', '-11.2', { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Scale', 1.37, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
			.assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'transform': 'translateX(-40px) translateY(-23px) rotate(-11.2deg) scale(1.37)',
				},
			} )
	}

	assertMotionEffects( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		// Entrance Animation
		cy.adjust( 'Effect', 'entrance' )

		// TODO: support null values in Stackable overwrite commands -> only to change the viewport & state controls
		cy.adjust( 'Start Position', null, { viewport } )
		cy.adjust( 'Horizontal Position', 34 )
		cy.adjust( 'Vertical Position', 52 )
		cy.adjust( 'Scale', 0.85 )
		cy.adjust( 'Rotate', 136.8 )
			.assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'--entrance-transform': 'translateX(34px) translateY(52px) scale(0.85) rotate(136.8deg)',
				},
			} )

		if ( viewport === 'Desktop' ) {
			Array( 'slow', 'fast' ).forEach( value => {
				cy.adjust( 'Entrance Animation Speed', value ).assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'--entrance-duration': `${ value === 'slow' ? '2s' : '0.75s' }`,
					},
				} )
			} )
			cy.adjust( 'Entrance Animation Delay', 0.85 ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'--entrance-delay': '0.85',
				},
			} )

			// Scroll Animation
			cy.adjust( 'Effect', 'scroll' )
			cy.adjust( 'Smoothen Scroll Animation', true ).assertClassName( MAIN_SELECTOR, 'stk-animate-smooth', { assertBackend: false } )
			cy.adjust( 'Use 3D Transforms', true )
			cy.adjust( 'Perspective', 1700 ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-perspective-in', '1700' )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-perspective-out', '1700' )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'transform': 'perspective(1700px) translate3d(0.0001px, 0.0001px, 0.0001px)', // TODO: Update to correct value
				},
			}, { assertBackend: false } )

			// TODO: Update the parent selectors
			const entranceAnimationParentSelector = '.stk-effects-entrance-transforms-control:contains(Entrance Animation) .stk-control-content'
			const exitAnimationParentSelector = '.stk-effects-entrance-transforms-control:contains(Exit Animation) .stk-control-content'

			// Entrance Animation
			cy.adjust( 'Opacity', '0.45', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-opacity-in', '0.45' )
			cy.adjust( 'Translate X', '57', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-translatex-in', '57' )
			cy.adjust( 'TranslateY', '-31', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-translatey-in', '-31' )
			cy.adjust( 'TranslateZ', '-26', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-translatez-in', '-26' )
			cy.adjust( 'RotateX', '107', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-rotatex-in', '107' )
			cy.adjust( 'RotateY', '89', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-rotatey-in', '89' )
			cy.adjust( 'Rotate', '-65', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-rotate-in', '-65' )
			cy.adjust( 'Scale', '0.8', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-scale-in', '0.8' )
			cy.adjust( 'Blur', '2', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-blur-in', '2' )
			cy.adjust( 'Skew X', '11', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-skewx-in', '11' )
			cy.adjust( 'Skew Y', '16', { parentSelector: entranceAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-skewy-in', '16' )

			// Exit Animation
			cy.adjust( 'Opacity', '0.75', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-opacity-out', '0.75' )
			cy.adjust( 'Translate X', '-56', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-translatex-out', '-56' )
			cy.adjust( 'TranslateY', '48', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-translatey-out', '48' )
			cy.adjust( 'TranslateZ', '-74', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-translatez-out', '-74' )
			cy.adjust( 'RotateX', '51', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-rotatex-out', '51' )
			cy.adjust( 'RotateY', '-43', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-rotatey-out', '-43' )
			cy.adjust( 'Rotate', '64', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-rotate-out', '64' )
			cy.adjust( 'Scale', '1.2', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-scale-out', '1.2' )
			cy.adjust( 'Blur', '3', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-blur-out', '3' )
			cy.adjust( 'Skew X', '9', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-skewx-out', '9' )
			cy.adjust( 'Skew Y', '20', { parentSelector: exitAnimationParentSelector } ).assertHtmlAttribute( MAIN_SELECTOR, 'data-stk-anim-skewy-out', '20' )
		}
	}

	assertCustomAttributes( {
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		cy.adjust( 'Custom Attributes', 'data-type="some-text"' ).assertHtmlAttribute( MAIN_SELECTOR, 'data-type', 'some-text' )
		cy.adjust( 'Custom Attributes', 'data-type="some-text" aria-label="block"' ).assertHtmlAttribute( MAIN_SELECTOR, 'aria-label', 'block' )
		cy.adjust( 'Custom Attributes', 'data-type="some-text" aria-label="block" data-title="title123"' ).assertHtmlAttribute( MAIN_SELECTOR, 'data-title', 'title123' )
	}

	assertCustomCSS( {
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		const assertionObj = {}
		const customCssString = `
			${ MAIN_SELECTOR } {
				color: #808080;
			}
		`
		assertionObj[ MAIN_SELECTOR ] = { 'color': '#808080' }

		cy.setBlockAttribute( {
			'customCSS': customCssString,
		} )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( assertionObj )
	}

	assertResponsive( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || null
		cy.adjust( `Hide on ${ viewport }`, true ).assertClassName( MAIN_SELECTOR, `stk--hide-${ lowerCase( viewport ) }` )
	}

	// TODO: Add tests for Conditional Display
}

export const Advanced = new AdvancedModule()

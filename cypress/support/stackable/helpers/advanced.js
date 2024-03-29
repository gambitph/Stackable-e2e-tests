/**
 * External dependencies
 */
import {
	keys, compact, lowerCase,
} from 'lodash'
import { containsRegExp } from '~common/util'

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
		generalEditorSelectorIsSelected = false,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		if ( viewport === 'Desktop' ) {
			const tags = [ 'address', 'article', 'aside', 'blockquote', 'div', 'details', 'footer', 'header', 'hgroup', 'main', 'nav', 'section', 'summary' ]
			tags.forEach( tag => {
				cy.adjust( 'Block HTML Tag', tag ).assertHtmlTag( MAIN_SELECTOR, tag, { assertBackend: false } )
			} )

			const clear = [ 'left', 'right', 'both', 'none' ]
			clear.forEach( value => {
				cy.adjust( 'Clear', value ).assertComputedStyle( {
					[ `${ generalEditorSelectorIsSelected ? '' : MAIN_SELECTOR }` ]: {
						'clear': value,
					},
				}, { assertFrontend: false } )
				cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'clear': value,
					},
				}, { assertBackend: false } )
			} )
		}

		const overflow = [ 'auto', 'hidden', 'scroll', 'visible' ]
		overflow.forEach( value => {
			cy.adjust( 'Overflow', value, { viewport } ).assertComputedStyle( {
				[ `${ generalEditorSelectorIsSelected ? '' : MAIN_SELECTOR }` ]: {
					'overflow': value,
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'overflow': value,
				},
			}, { assertBackend: false } )
		} )
	}

	assertPosition( {
		viewport,
		mainSelector = null,
		positionEditorSelectorIsSelected = false,
		positionEditorSelector = '',
		positionFrontendSelector = '',
		assertPositionUnits = true,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		cy.adjust( 'Opacity', 0.8, { viewport, state: 'normal' } ).assertComputedStyle( {
			[ `${ positionEditorSelectorIsSelected ? '' : MAIN_SELECTOR }` ]: {
				'opacity': '0.8',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ MAIN_SELECTOR ]: {
				'opacity': '0.8',
			},
		}, { assertBackend: false } )

		cy.adjust( 'Opacity', 0.6, { viewport, state: 'hover' } ).assertComputedStyle( {
			[ `${ positionEditorSelectorIsSelected ? '' : MAIN_SELECTOR }:hover` ]: {
				'opacity': '0.6',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ `${ MAIN_SELECTOR }:hover` ]: {
				'opacity': '0.6',
			},
		}, { assertBackend: false } )

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
			cy.adjust( '.components-base-control:contains(Position):first', value, { viewport } ).assertComputedStyle( {
				[ `${ positionEditorSelectorIsSelected ? '' : MAIN_SELECTOR }` ]: {
					'position': value,
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'position': value,
				},
			}, { assertBackend: false } )
		} )

		// Normal state - px unit
		cy.adjust( '.components-base-control:contains(Position):last', [ 5, 4, 3, 2 ], {
			viewport, state: 'normal', unit: 'px',
		} ).assertComputedStyle( {
			[ `${ positionEditorSelectorIsSelected ? '' : positionEditorSelector ? positionEditorSelector : MAIN_SELECTOR }` ]: {
				'top': '5px',
				'right': '4px',
				'bottom': '3px',
				'left': '2px',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ `${ positionFrontendSelector ? positionFrontendSelector : MAIN_SELECTOR }` ]: {
				'top': '5px',
				'right': '4px',
				'bottom': '3px',
				'left': '2px',
			},
		}, { assertBackend: false } )

		// Hover state - px unit
		cy.adjust( '.components-base-control:contains(Position):last', [ 16, 17, 18, 19 ], {
			viewport, state: 'hover', unit: 'px',
		} ).assertComputedStyle( {
			[ `${ positionEditorSelectorIsSelected ? '' : positionEditorSelector ? positionEditorSelector : MAIN_SELECTOR }:hover` ]: {
				'top': '16px',
				'right': '17px',
				'bottom': '18px',
				'left': '19px',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ `${ positionFrontendSelector ? positionFrontendSelector : MAIN_SELECTOR }:hover` ]: {
				'top': '16px',
				'right': '17px',
				'bottom': '18px',
				'left': '19px',
			},
		}, { assertBackend: false } )

		cy.resetStyle( '.components-base-control:contains(Position):last', { viewport, state: 'hover' } )
		cy.resetStyle( '.components-base-control:contains(Position):last', { viewport, state: 'normal' } )

		if ( assertPositionUnits ) {
			// Normal state - % unit
			cy.adjust( '.components-base-control:contains(Position):last', [ 23, 24, 25, 26 ], {
				viewport, state: 'normal', unit: '%',
			} ).assertComputedStyle( {
				[ `${ positionEditorSelectorIsSelected ? '' : positionEditorSelector ? positionEditorSelector : MAIN_SELECTOR }` ]: {
					'top': '23%',
					'right': '24%',
					'bottom': '25%',
					'left': '26%',
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ `${ positionFrontendSelector ? positionFrontendSelector : MAIN_SELECTOR }` ]: {
					'top': '23%',
					'right': '24%',
					'bottom': '25%',
					'left': '26%',
				},
			}, { assertBackend: false } )

			// Hover state - % unit
			cy.adjust( '.components-base-control:contains(Position):last', [ 20, 21, 22, 23 ], {
				viewport, state: 'hover', unit: '%',
			} ).assertComputedStyle( {
				[ `${ positionEditorSelectorIsSelected ? '' : positionEditorSelector ? positionEditorSelector : MAIN_SELECTOR }:hover` ]: {
					'top': '20%',
					'right': '21%',
					'bottom': '22%',
					'left': '23%',
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ `${ positionFrontendSelector ? positionFrontendSelector : MAIN_SELECTOR }:hover` ]: {
					'top': '20%',
					'right': '21%',
					'bottom': '22%',
					'left': '23%',
				},
			}, { assertBackend: false } )
		}
	}

	assertTransformTransition( {
		viewport,
		mainSelector = null,
		transformTransitionEditorSelectorIsSelected = false,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Transition Duration (secs)', '0.79' ).assertComputedStyle( {
				[ `${ MAIN_SELECTOR }` ]: {
					'transition-duration': '0.79s',
				},
			}, { assertBackend: false } )

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
					[ `${ MAIN_SELECTOR }` ]: {
						'transition-timing-function': value,
					},
				}, { assertBackend: false } )
			} )

			const transformOrigin = [ 'top left', 'top center', 'top center', 'center left', 'center center', 'center right', 'bottom left', 'bottom center', 'bottom right' ]
			transformOrigin.forEach( value => {
				cy.adjust( 'Transform Origin', value ).assertComputedStyle( {
					[ `${ transformTransitionEditorSelectorIsSelected ? '' : MAIN_SELECTOR }` ]: {
						'transform-origin': value,
					},
				}, { assertFrontend: false } )
				cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
					[ `${ MAIN_SELECTOR }` ]: {
						'transform-origin': value,
					},
				}, { assertBackend: false } )
			} )
		}

		const setParentControlToHover = () => cy
			.adjust( 'Transform', null, { viewport, state: 'hover' } )

		cy.adjust( 'Transform', null, { viewport, state: 'normal' } )
		cy.adjust( 'Translate X', 21, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Translate Y', 16, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Rotate', 14.3, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		cy.adjust( 'Scale', 0.89, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } ).assertComputedStyle( {
			[ `${ transformTransitionEditorSelectorIsSelected ? '' : MAIN_SELECTOR }` ]: {
				'transform': 'translateX(21px) translateY(16px) rotate(14.3deg) scale(0.89)',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ `${ MAIN_SELECTOR }` ]: {
				'transform': 'translateX(21px) translateY(16px) rotate(14.3deg) scale(0.89)',
			},
		}, { assertBackend: false } )

		setParentControlToHover()
		cy.adjust( 'Translate X', '-40', { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		setParentControlToHover()
		cy.adjust( 'Translate Y', '-23', { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		setParentControlToHover()
		cy.adjust( 'Rotate', '-11.2', { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } )
		setParentControlToHover()
		cy.adjust( 'Scale', 1.37, { parentSelector: '.ugb-panel--transform-transition .stk-control-content' } ).assertComputedStyle( {
			[ `${ transformTransitionEditorSelectorIsSelected ? '' : MAIN_SELECTOR }:hover` ]: {
				'transform': 'translateX(-40px) translateY(-23px) rotate(-11.2deg) scale(1.37)',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ `${ MAIN_SELECTOR }:hover` ]: {
				'transform': 'translateX(-40px) translateY(-23px) rotate(-11.2deg) scale(1.37)',
			},
		}, { assertBackend: false } )
	}

	assertMotionEffects( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'
		const parentSelector = '.stk-effects-entrance-transforms-control > .components-base-control__field > .stk-control-content'

		// Entrance Animation
		cy.adjust( 'Effect', 'entrance' )

		cy.adjust( 'Start Position', null, { viewport } )
		cy.adjust( 'Horizontal Position', 34, { parentSelector } )
		cy.adjust( 'Vertical Position', 52, { parentSelector } )
		cy.adjust( 'Scale', 0.85, { parentSelector } )
		cy.adjust( 'Rotate', 136.8, { parentSelector } )
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
		viewport,
		mainSelector = null,
		customSelector = null,
	} ) {
		if ( viewport === 'Desktop' ) {
			const MAIN_SELECTOR = customSelector || mainSelector || '.stk-block'

			cy.adjust( 'Custom Attributes', 'data-type="some-text"' ).assertHtmlAttribute( MAIN_SELECTOR, 'data-type', 'some-text' )
			cy.adjust( 'Custom Attributes', 'data-type="some-text" aria-label="block"' ).assertHtmlAttribute( MAIN_SELECTOR, 'aria-label', 'block' )
			cy.adjust( 'Custom Attributes', 'data-type="some-text" aria-label="block" data-title="title123"' ).assertHtmlAttribute( MAIN_SELECTOR, 'data-title', 'title123' )
		}
	}

	assertCustomCSS( {
		viewport,
		mainSelector = null,
	} ) {
		if ( viewport === 'Desktop' ) {
			const MAIN_SELECTOR = mainSelector || '.stk-block'

			const assertionObj = {}
			const customCssString = `
				${ MAIN_SELECTOR } {
					color: red;
				}
			`
			assertionObj[ MAIN_SELECTOR ] = { 'color': 'red' }

			cy.setBlockAttribute( {
				'customCSS': customCssString,
			} )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( assertionObj )
		}
	}

	assertResponsive( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || null
		cy.adjust( `Hide on ${ viewport }`, true ).assertClassName( MAIN_SELECTOR, `stk--hide-${ lowerCase( viewport ) }`, { assertBackend: false } )
	}

	assertConditionalDisplay( {
		viewport,
		mainSelector = null,
		blockName,
		postType = 'page',
	} ) {
		if ( viewport === 'Desktop' ) {
			const MAIN_SELECTOR = mainSelector || null

			const selectInspector = () => {
				cy.selectBlock( blockName )
				cy.openInspector( blockName, 'Advanced' )
				cy.collapse( 'Conditional Display' )
			}

			const assertFrontendExistence = assertionValue => {
				cy.savePost()
				cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
					cy.visit( previewUrl )
					cy.get( MAIN_SELECTOR ).should( assertionValue )
					cy.visit( editorUrl )
					selectInspector()
				} )
			}

			const parentSelector = '.stk-condition-component'

			const addNewCondition = () => cy
				.get( '.ugb-panel--conditional-display' )
				.contains( containsRegExp( 'Add New Condition' ) )
				.click( { force: true } )

			addNewCondition()
			// Login Status
			cy.adjust( 'Condition Type', 'login-status', { parentSelector } )
			cy.adjust( '.components-base-control:contains(Login Status):last', 'logged-in', { parentSelector } )
			assertFrontendExistence( 'exist' )

			cy.adjust( '.components-base-control:contains(Login Status):last', 'logged-out', { parentSelector } )
			assertFrontendExistence( 'not.exist' )

			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'login-status', { parentSelector } )
			cy.adjust( '.components-base-control:contains(Login Status):last', 'logged-in', { parentSelector } )
			assertFrontendExistence( 'not.exist' )

			cy.adjust( 'Condition Type', 'login-status', { parentSelector } )
			cy.adjust( '.components-base-control:contains(Login Status):last', 'logged-out', { parentSelector } )
			assertFrontendExistence( 'exist' )

			// Role
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'role', { parentSelector } )
			cy.adjust( 'Enter Role', [ 'Administrator', 'Subscriber' ], { parentSelector, mainComponentSelector: '.components-form-token-field' } )
			assertFrontendExistence( 'not.exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'exist' )

			// Date & Time
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'date-time', { parentSelector } )
			cy.adjust( 'Start Date', {
				day: '4',
				month: 'November',
				year: '2021',
			}, { parentSelector } )
			cy.adjust( 'Sunday', true, { parentSelector: `${ parentSelector } .stk-days-checkbox > .components-base-control__field` } )
			cy.adjust( 'Monday', true, { parentSelector: `${ parentSelector } .stk-days-checkbox > .components-base-control__field` } )
			cy.adjust( 'Tuesday', true, { parentSelector: `${ parentSelector } .stk-days-checkbox > .components-base-control__field` } )
			cy.adjust( 'Wednesday', true, { parentSelector: `${ parentSelector } .stk-days-checkbox > .components-base-control__field` } )
			cy.adjust( 'Thursday', true, { parentSelector: `${ parentSelector } .stk-days-checkbox > .components-base-control__field` } )
			cy.adjust( 'Friday', true, { parentSelector: `${ parentSelector } .stk-days-checkbox > .components-base-control__field` } )
			cy.adjust( 'Saturday', true, { parentSelector: `${ parentSelector } .stk-days-checkbox > .components-base-control__field` } )
			assertFrontendExistence( 'not.exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'exist' )

			// Custom PHP
			cy.adjust( 'Condition Type', 'custom-php', { parentSelector } )
			cy.adjust( '.components-base-control:contains(Custom PHP):last', '$_GET[ \'preview\' ] === \'true\'', { parentSelector } )
			assertFrontendExistence( 'exist' )

			cy.adjust( '.components-base-control:contains(Custom PHP):last', '$_GET[ \'preview\' ] !== \'true\'', { parentSelector } )
			assertFrontendExistence( 'not.exist' )

			// Conditional Tag
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'conditional-tag', { parentSelector } )
			cy.adjust( 'Enter Conditional Tag', [ 'Any Page - is_page' ], { parentSelector, mainComponentSelector: '.components-form-token-field' } )
			assertFrontendExistence( 'not.exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'exist' )

			// Query String
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'query-string', { parentSelector } )
			cy.adjust( 'Enter Queries', 'preview=true', { parentSelector } )
			assertFrontendExistence( 'not.exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'exist' )

			// Post Meta
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'post-meta', { parentSelector } )
			cy.adjust( 'Post Meta Key', 'type', { parentSelector } )
			cy.adjust( 'Operator', 'equal', { parentSelector } )
			cy.adjust( 'Enter Value', 'page', { parentSelector } )
			// TODO: Assert Post Meta condition.

			// Site Option
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'site-option', { parentSelector } )
			cy.adjust( 'Option Name', 'blogname', { parentSelector } )
			cy.adjust( 'Operator', 'equal', { parentSelector } )
			cy.adjust( 'Enter Value', 'e2etest', { parentSelector } )
			assertFrontendExistence( 'not.exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'exist' )

			// Post IDs
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'post-id', { parentSelector } )
			cy.getPostData().then( data => {
				cy.adjust( 'Enter Post IDs', [ `${ data.id },` ], { parentSelector, mainComponentSelector: '.components-form-token-field' } )
			} )
			assertFrontendExistence( 'not.exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'exist' )

			// Post Type
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'post-type', { parentSelector } )
			cy.adjust( 'Enter Post Types', [ postType ], { parentSelector, mainComponentSelector: '.components-form-token-field' } )
			assertFrontendExistence( 'not.exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'exist' )

			// Post Taxonomy
			cy.adjust( 'Visibility', 'hide' )
			cy.adjust( 'Condition Type', 'post-taxonomy', { parentSelector } )
			cy.adjust( 'Post Type', 'post', { parentSelector: `${ parentSelector } > .stk-taxonomy-control` } )
			cy.adjust( 'Filter by Taxonomy', 'category', { parentSelector: `${ parentSelector } > .stk-taxonomy-control` } )
			cy.adjust( 'Taxonomy Filter Type', '__in', { parentSelector: `${ parentSelector } > .stk-taxonomy-control` } )
			// TODO: Assert Post Taxonomy condition.

			// Test Multiple conditions
			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			cy.adjust( 'Condition Type', 'login-status', { parentSelector } )
			cy.adjust( '.components-base-control:contains(Login Status):last', 'logged-out', { parentSelector } )
			addNewCondition()
			cy.adjust( '.components-base-control:contains(Condition Type):last', 'role', { parentSelector } )
			cy.adjust( 'Enter Role', [ 'Editor' ], { parentSelector, mainComponentSelector: '.components-form-token-field' } )
			cy.adjust( 'Trigger if ANY condition matches', true )
			assertFrontendExistence( 'not.exist' )

			cy.adjust( '.components-base-control:contains(Login Status):nth-of-type(2)', 'logged-in', { parentSelector } )
			assertFrontendExistence( 'exist' )

			cy.adjust( 'Visibility', 'hide' )
			assertFrontendExistence( 'not.exist' )

			cy.adjust( 'Trigger if ALL conditions match', true )
			assertFrontendExistence( 'exist' )

			cy.resetStyle( 'Visibility' ) // Reset visibility to show
			assertFrontendExistence( 'not.exist' )
		}
	}

	assertAdvanced( {
		viewport,
		mainSelector = null,
		customSelector = null,
	} ) {
		if ( viewport === 'Desktop' ) {
			const MAIN_SELECTOR = customSelector || mainSelector || '.stk-block'
			cy.adjust( 'HTML anchor', 'e2e-html-anchor' ).assertHtmlAttribute( MAIN_SELECTOR, 'id', 'e2e-html-anchor' )
		}
	}
}

export const Advanced = new AdvancedModule()

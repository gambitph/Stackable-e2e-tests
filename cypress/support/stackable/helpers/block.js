/**
 * External dependencies
 */
import { lowerCase } from 'lodash'

/**
 * Internal dependencies
 */
import { Module } from './internals'

class BlockModule extends Module {
	constructor() {
		super()
		this.registerTest( 'Alignment', this.assertAlignment )
		this.registerTest( 'Background', this.assertBackground )
		this.registerTest( 'Size & Spacing', this.assertSizeSpacing )
		this.registerTest( 'Borders & Shadows', this.assertBordersShadows )
		this.registerTest( 'Link', this.assertLink )
		this.registerTest( 'Top Separator', this.assertTopSeparator )
		this.registerTest( 'Bottom Separator', this.assertBottomSeparator )
		this.setModuleName( 'Block Tab' )
	}

	assertAlignment( {
		viewport,
		mainSelector = null,
		alignmentSelector,
		enableContentAlignment = true,
		enableColumnAlignment = true,
		enableInnerBlockAlignment = true,
		enableInnerBlockVerticalAlignment = true,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		if ( enableContentAlignment ) {
			const textAligns = [ 'left', 'center', 'right' ]
			textAligns.forEach( align => {
				const alignValue = align === 'left' ? 'start'
					: align === 'right' ? 'end'
						: align
				const responsiveClass = viewport === 'Desktop' ? '' : `-${ lowerCase( viewport ) }`
				cy.adjust( 'Content Alignment', align, { viewport } )
					.assertComputedStyle( { [ alignmentSelector ]: { 'text-align': alignValue } } )
				cy.get( '.block-editor-block-list__block.is-selected' )
					.assertClassName( alignmentSelector, `has-text-align-${ align }${ responsiveClass }` )
			} )
		}

		if ( enableColumnAlignment ) {
			const columnAligns = [ 'flex-start', 'center', 'flex-end', 'stretch' ]
			columnAligns.forEach( align => {
				cy.adjust( 'Column Alignment', align, { viewport } )
				cy.get( MAIN_SELECTOR ).invoke( 'attr', 'data-block-id' ).then( blockId => {
					cy.get( '.block-editor-block-list__block.is-selected' ).then( $block => {
						if ( $block.find( `.stk--block-align-${ blockId }` ).length ) {
							// If the block alignment classname is present, separate the assertion for backend and frontend
							cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
								[ `.stk--block-align-${ blockId } > .block-editor-inner-blocks > .block-editor-block-list__layout` ]: {
									'align-items': align,
								},
							}, { assertFrontend: false } )
							cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
								[ `.stk--block-align-${ blockId }` ]: {
									'align-items': align,
								},
							}, { assertBackend: false } )
							return
						}
						cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
							[ `.stk-${ blockId }` ]: {
								'align-self': align,
							},
						} )
					} )
				} )
			} )
		}

		if ( enableInnerBlockAlignment ) {
			if ( viewport === 'Desktop' ) {
				cy.adjust( 'Inner Block Alignment', 'horizontal' )
					.assertClassName( alignmentSelector, 'stk--block-orientation-horizontal' )
				cy.resetStyle( 'Inner Block Alignment' )
			}
		}

		if ( enableInnerBlockVerticalAlignment ) {
			const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
			verticalAligns.forEach( align => {
				cy.adjust( 'Inner Block Vertical Alignment', align, { viewport } )
					.assertComputedStyle( {
						'.block-editor-block-list__layout': {
							'justify-content': align,
						},
					}, { assertFrontend: false } )

				cy.adjust( 'Inner Block Vertical Alignment', align, { viewport } )
					.assertComputedStyle( {
						[ alignmentSelector ]: {
							'justify-content': align,
						},
					}, { assertBackend: false } )
			} )
		}
	}

	assertBackground( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		cy.toggleStyle( 'Background' )
		if ( viewport !== 'Desktop' ) {
			cy.setBlockAttribute( {
				[ `blockBackgroundMediaUrl${ viewport }` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
			} )
		}

		if ( viewport === 'Desktop' ) {
			// Adjust single container color options.
			cy.adjust( 'Color Type', 'single' )
			cy.adjust( 'Background Color', '#632d2d', { state: 'normal' } )
			cy.adjust( 'Background Color Opacity', 0.8, { state: 'normal' } )
				.assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'background-color': 'rgba( 99, 45, 45, 0.8 )',
					},
				} )
			cy.adjust( 'Background Color', '#ffff00', { state: 'hover' } )
			cy.adjust( 'Background Color Opacity', 0.6, { state: 'hover' } )
				.assertComputedStyle( {
					[ `${ MAIN_SELECTOR }:hover` ]: {
						'background-color': 'rgba(255, 255, 0, 0.6)',
					},
				} )

			cy.setBlockAttribute( {
				'blockBackgroundMediaUrl': Cypress.env( 'DUMMY_IMAGE_URL' ),
			} )

			// Adjust gradient container color options.
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Background Color #1', '#f1ff97' )
			cy.adjust( 'Background Color #2', '#ffbaba' )
			cy.adjust( 'Adv. Gradient Color Settings', {
				'Gradient Direction (degrees)': 180,
				'Color 1 Location': 11,
				'Color 2 Location': 80,
				'Background Gradient Blend Mode': 'difference',
			} ).assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:before` ]: {
					'background-image': 'linear-gradient(180deg, #f1ff97 11%, #ffbaba, 80%)',
					'mix-blend-mode': 'difference',
				},
			} )

			cy.adjust( 'Background Media Tint Strength', 7, { state: 'normal' } ).assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:before` ]: {
					'opacity': '0.7',
				},
			} )
			cy.adjust( 'Background Media Tint Strength', 4, { state: 'hover' } ).assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:before` ]: {
					'opacity': '0.4',
				},
			}, {
				isHoverState: true,
			} )
			cy.adjust( 'Fixed Background', true )
			cy.adjust( 'Adv. Background Image Settings', {
				'Image Blend Mode': 'hue',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'background-blend-mode': 'hue',
					'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
					'background-attachment': 'fixed',
				},
			} )
		}

		cy.adjust( 'Adv. Background Image Settings', {
			'Image Position': {
				viewport,
				value: 'center center',
			},
			'Image Repeat': {
				viewport,
				value: 'repeat-x',
			},
			'Image Size': {
				viewport,
				value: 'custom',
			},
			'Custom Size': {
				viewport,
				value: 19,
				unit: '%',
			},
		} ).assertComputedStyle( {
			[ MAIN_SELECTOR ]: {
				'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
				'background-position': '50% 50%',
				'background-repeat': 'repeat-x',
				'background-size': '19%',
			},
		} )
	}

	assertSizeSpacing( {
		viewport,
		mainSelector = null,
		enableMinHeight = true,
		enableContentVerticalAlign = true,
		enableMaxContentWidth = true,
		enablePaddings = true,
		enableMargins = true,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'
		const aligns = [ 'flex-start', 'center', 'flex-end' ]

		if ( enableMinHeight ) {
			cy.adjust( 'Min. Height', 387, {
				viewport, unit: 'px',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'min-height': '387px',
				},
			} )
			cy.resetStyle( 'Min. Height', { viewport } )

			cy.adjust( 'Min. Height', 53, {
				viewport, unit: 'vh',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'min-height': '53vh',
				},
			} )
			cy.resetStyle( 'Min. Height', { viewport } )
		}

		if ( enableContentVerticalAlign ) {
			aligns.forEach( align => {
				cy.adjust( 'Content Vertical Align', align, { viewport } )
					.assertComputedStyle( {
						[ MAIN_SELECTOR ]: {
							'align-items': align,
						},
					} )
			} )
		}

		if ( enableMaxContentWidth ) {
			cy.adjust( 'Max. Content Width', 819, {
				viewport, unit: 'px',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'max-width': '819px',
					'min-width': 'auto',
				},
			} )
			cy.resetStyle( 'Max. Content Width', { viewport } )

			cy.adjust( 'Max. Content Width', 54, {
				viewport, unit: '%',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'max-width': '54%',
					'min-width': 'auto',
				},
			} )

			// Additional control added when Max. Content Width is adjusted:
			aligns.forEach( align => {
				// Content Horizontal Align is conditionally rendered upon editing the Width
				cy.adjust( 'Max. Content Width', 54, {
					viewport, unit: '%',
				} )
				cy.adjust( 'Content Horizontal Align', align, { viewport } )
					.assertComputedStyle( {
						[ MAIN_SELECTOR ]: {
							'justify-content': align,
						},
					} )
			} )
		}

		if ( enablePaddings ) {
			// Unit - px
			cy.adjust( 'Paddings', [ 141, 142, 143, 144 ], {
				viewport, unit: 'px', state: 'hover',
			} ).assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'padding-top': '141px',
					'padding-right': '142px',
					'padding-bottom': '143px',
					'padding-left': '144px',
				},
			} )
			cy.adjust( 'Paddings', [ 151, 152, 153, 154 ], {
				viewport, unit: 'px', state: 'normal',
			} ).assertComputedStyle( {
				[  MAIN_SELECTOR ]: {
					'padding-top': '151px',
					'padding-right': '152px',
					'padding-bottom': '153px',
					'padding-left': '154px',
				},
			} )
			cy.resetStyle( 'Paddings', {
				viewport, unit: 'px', state: 'hover',
			} )
			cy.resetStyle( 'Paddings', {
				viewport, unit: 'px', state: 'normal',
			} )

			// Unit - em
			cy.adjust( 'Paddings', [ 23, 24, 25, 26 ], {
				viewport, unit: 'em', state: 'hover',
			} ).assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'padding-top': '23em',
					'padding-right': '24em',
					'padding-bottom': '25em',
					'padding-left': '26em',
				},
			} )
			cy.adjust( 'Paddings', [ 19, 20, 21, 22 ], {
				viewport, unit: 'em', state: 'normal',
			} ).assertComputedStyle( {
				[  MAIN_SELECTOR ]: {
					'padding-top': '19em',
					'padding-right': '20em',
					'padding-bottom': '21em',
					'padding-left': '22em',
				},
			} )
			cy.resetStyle( 'Paddings', {
				viewport, unit: 'em', state: 'hover',
			} )
			cy.resetStyle( 'Paddings', {
				viewport, unit: 'em', state: 'normal',
			} )

			// Unit - %
			cy.adjust( 'Paddings', [ 77, 78, 79, 80 ], {
				viewport, unit: '%', state: 'normal',
			} ).assertComputedStyle( {
				[  MAIN_SELECTOR ]: {
					'padding-top': '77%',
					'padding-right': '78%',
					'padding-bottom': '79%',
					'padding-left': '80%',
				},
			} )
			cy.adjust( 'Paddings', [ 67, 68, 69, 70 ], {
				viewport, unit: '%', state: 'hover',
			} ).assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'padding-top': '67%',
					'padding-right': '68%',
					'padding-bottom': '69%',
					'padding-left': '70%',
				},
			} )
			cy.resetStyle( 'Paddings', {
				viewport, unit: '%', state: 'hover',
			} )
			cy.resetStyle( 'Paddings', {
				viewport, unit: '%', state: 'normal',
			} )
		}

		if ( enableMargins ) {
			cy.adjust( 'Margins', [ 141, 142, 143, 144 ], {
				viewport, unit: 'px',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'margin-top': '141px',
					'margin-right': '142px',
					'margin-bottom': '143px',
					'margin-left': '144px',
				},
			} )

			cy.adjust( 'Margins', [ 67, 68, 69, 70 ], {
				viewport, unit: '%',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'margin-top': '67%',
					'margin-right': '68%',
					'margin-bottom': '69%',
					'margin-left': '70%',
				},
			} )
		}
	}

	assertBordersShadows( {
		viewport,
		mainSelector = null,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Borders', 'solid' ).assertComputedStyle( { [ MAIN_SELECTOR ]: { 'border-style': 'solid' } } )
			cy.adjust( 'Borders', 'dashed' ).assertComputedStyle( { [ MAIN_SELECTOR ]: { 'border-style': 'dashed' } } )
			cy.adjust( 'Borders', 'dotted' ).assertComputedStyle( { [ MAIN_SELECTOR ]: { 'border-style': 'dotted' } } )
		} else {
			cy.adjust( 'Borders', 'solid' )
		}

		cy.adjust( 'Border Width', [ 11, 12, 13, 14 ], { viewport, state: 'normal' } )
			.assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'border-top-width': '11px',
					'border-right-width': '12px',
					'border-bottom-width': '13px',
					'border-left-width': '14px',
				},
			} )
		cy.adjust( 'Border Width', [ 7, 8, 9, 10 ], { viewport, state: 'hover' } )
			.assertComputedStyle( {
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'border-top-width': '7px',
					'border-right-width': '8px',
					'border-bottom-width': '9px',
					'border-left-width': '10px',
				},
			} )

		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Border Color', '#0d00ff', { state: 'normal' } )
				.assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'border-color': '#0d00ff',
					},
				} )
			cy.adjust( 'Border Color', '#b6c44f', { state: 'hover' } )
				.assertComputedStyle( {
					[ `${ MAIN_SELECTOR }:hover` ]: {
						'border-color': '#b6c44f',
					},
				} )
		}

		cy.adjust( 'Border Radius', 61, { viewport } )
			.assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'border-radius': '61px',
				},
			} )

		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Shadow / Outline', 6, { state: 'normal' } )
				.assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'box-shadow': '0px 10px 30px rgba(0, 0, 0, 0.05)',
					},
				} )
			cy.adjust( 'Shadow / Outline', 8, { state: 'hover' } )
				.assertComputedStyle( {
					[ `${ MAIN_SELECTOR }:hover` ]: {
						'box-shadow': '0px 10px 60px rgba(0, 0, 0, 0.1)',
					},
				} )
		}
	}

	assertLink( {
		viewport,
	} ) {
		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Link / URL', 'https://wpstackable.com/' ).assertHtmlAttribute( '.stk-block-link', 'href', 'https://wpstackable.com/', { assertBackend: false } )
			cy.adjust( 'Open in new tab', true ).assertHtmlAttribute( '.stk-block-link', 'rel', /noreferrer noopener/, { assertBackend: false } )
			cy.adjust( 'Link rel', 'sponsored ugc' ).assertHtmlAttribute( '.stk-block-link', 'rel', /sponsored ugc/, { assertBackend: false } )
		}
		cy.savePost()
	}

	assertTopSeparator( {
		viewport,
	} ) {
		cy.toggleStyle( 'Top Separator' )
		cy.adjust( 'Design', 'slant-2' )
		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Color', '#bb3e3e' )
			cy.adjust( 'Width', 1.4 )
			cy.adjust( 'Shadow / Outline', 3 )
			cy.adjust( 'Invert Design', true )
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Bring to Front', true ).assertComputedStyle( {
				'.stk-separator__top svg': {
					'fill': '#bb3e3e',
					'filter': 'drop-shadow(2px 4px 6px #000)',
				},
				'.stk-separator__top .stk-separator__wrapper': {
					'transform': 'scaleX(1.4)',
				},
				'.stk-separator__top': {
					'z-index': '6',
					'transform': 'scaleX(-1) scaleY(-1)',
				},
			} )
		}
		cy.adjust( 'Height', 248, { viewport } ).assertComputedStyle( {
			'.stk-separator__top .stk-separator__wrapper': {
				'height': '248px',
			},
		} )
		cy.adjust( 'Separator Layer 2', true )
		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Separator Layer 2', {
				'Color': '#2b60ff',
				'Layer Width': 1.7,
			} ).assertComputedStyle( {
				'.stk-separator__top .stk-separator__wrapper .stk-separator__layer-2': {
					'fill': '#2b60ff',
					'transform': 'scaleX(1.7)',
				},
			} )
			cy.adjust( 'Separator Layer 2', {
				'Flip Horizontally': true,
				'Opacity': 0.5,
				'Mix Blend Mode': 'difference',
			} ).assertComputedStyle( {
				'.stk-separator__top .stk-separator__wrapper .stk-separator__layer-2': {
					'transform': 'scaleX(-1) scaleX(1.7)',
					'opacity': '0.5',
					'mix-blend-mode': 'difference',
				},
			} )
			cy.resetStyle( 'Separator Layer 2' )
			cy.adjust( 'Separator Layer 2', true )
		}

		cy.adjust( 'Separator Layer 2', {
			'Layer Height': {
				value: 1.06,
				viewport,
			},
		} ).assertComputedStyle( {
			'.stk-separator__top .stk-separator__wrapper .stk-separator__layer-2': {
				'transform': 'scaleY(1.06)',
			},
		} )

		cy.adjust( 'Separator Layer 3', true )
		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Separator Layer 3', {
				'Color': '#ff7543',
				'Layer Width': 2.7,
			} ).assertComputedStyle( {
				'.stk-separator__top .stk-separator__wrapper .stk-separator__layer-3': {
					'fill': '#ff7543',
					'transform': 'scaleX(2.7)',
				},
			} )
			cy.adjust( 'Separator Layer 3', {
				'Flip Horizontally': true,
				'Opacity': 0.3,
			} ).assertComputedStyle( {
				'.stk-separator__top .stk-separator__wrapper .stk-separator__layer-3': {
					'transform': 'scaleX(-1) scaleX(2.7)',
					'opacity': '0.3',
				},
			} )
			cy.resetStyle( 'Separator Layer 3' )
			cy.adjust( 'Separator Layer 3', true )
		}

		cy.adjust( 'Separator Layer 3', {
			'Layer Height': {
				value: 0.93,
				viewport,
			},
		} ).assertComputedStyle( {
			'.stk-separator__top .stk-separator__wrapper .stk-separator__layer-3': {
				'transform': 'scaleY(0.93)',
			},
		} )
	}

	assertBottomSeparator( {
		viewport,
	} ) {
		cy.toggleStyle( 'Bottom Separator' )
		cy.adjust( 'Design', 'slant-2' )
		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Color', '#5dc8af' )
			cy.adjust( 'Width', 1.4 )
			cy.adjust( 'Shadow / Outline', 3 )
			cy.adjust( 'Invert Design', true )
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Bring to Front', true ).assertComputedStyle( {
				'.stk-separator__bottom svg': {
					'fill': '#5dc8af',
					'filter': 'drop-shadow(2px 4px 6px #000)',
				},
				'.stk-separator__bottom .stk-separator__wrapper': {
					'transform': 'scaleX(1.4)',
				},
				'.stk-separator__bottom': {
					'z-index': '6',
					'transform': 'scaleX(-1)',
				},
			} )
		}
		cy.adjust( 'Height', 248, { viewport } ).assertComputedStyle( {
			'.stk-separator__bottom .stk-separator__wrapper': {
				'height': '248px',
			},
		} )
		cy.adjust( 'Separator Layer 2', true )
		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Separator Layer 2', {
				'Color': '#2b60ff',
				'Layer Width': 1.7,
			} ).assertComputedStyle( {
				'.stk-separator__bottom .stk-separator__wrapper .stk-separator__layer-2': {
					'fill': '#2b60ff',
					'transform': 'scaleX(1.7)',
				},
			} )
			cy.adjust( 'Separator Layer 2', {
				'Flip Horizontally': true,
				'Opacity': 0.5,
				'Mix Blend Mode': 'difference',
			} ).assertComputedStyle( {
				'.stk-separator__bottom .stk-separator__wrapper .stk-separator__layer-2': {
					'transform': 'scaleX(-1) scaleX(1.7)',
					'opacity': '0.5',
					'mix-blend-mode': 'difference',
				},
			} )
			cy.resetStyle( 'Separator Layer 2' )
			cy.adjust( 'Separator Layer 2', true )
		}

		cy.adjust( 'Separator Layer 2', {
			'Layer Height': {
				value: 1.06,
				viewport,
			},
		} ).assertComputedStyle( {
			'.stk-separator__bottom .stk-separator__wrapper .stk-separator__layer-2': {
				'transform': 'scaleY(1.06)',
			},
		} )

		cy.adjust( 'Separator Layer 3', true )
		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Separator Layer 3', {
				'Color': '#ff7543',
				'Layer Width': 2.7,
			} ).assertComputedStyle( {
				'.stk-separator__bottom .stk-separator__wrapper .stk-separator__layer-3': {
					'fill': '#ff7543',
					'transform': 'scaleX(2.7)',
				},
			} )
			cy.adjust( 'Separator Layer 3', {
				'Flip Horizontally': true,
				'Opacity': 0.3,
			} ).assertComputedStyle( {
				'.stk-separator__bottom .stk-separator__wrapper .stk-separator__layer-3': {
					'transform': 'scaleX(-1) scaleX(2.7)',
					'opacity': '0.3',
				},
			} )
			cy.resetStyle( 'Separator Layer 3' )
			cy.adjust( 'Separator Layer 3', true )
		}

		cy.adjust( 'Separator Layer 3', {
			'Layer Height': {
				value: 0.93,
				viewport,
			},
		} ).assertComputedStyle( {
			'.stk-separator__bottom .stk-separator__wrapper .stk-separator__layer-3': {
				'transform': 'scaleY(0.93)',
			},
		} )
	}
}

export const Block = new BlockModule()

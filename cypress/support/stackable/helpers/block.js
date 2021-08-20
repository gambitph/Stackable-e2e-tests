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
				cy.adjust( 'Content Alignment', align, { viewport } )
					.assertComputedStyle( { [ alignmentSelector ]: { 'text-align': align } } )
				cy.get( '.block-editor-block-list__block.is-selected' )
					.assertClassName( alignmentSelector, `has-text-align-${ align }` )
			} )
		}

		if ( enableColumnAlignment ) {
			const columnAligns = [ 'flex-start', 'center', 'flex-end', 'stretch' ]
			columnAligns.forEach( align => {
				cy.adjust( 'Column Alignment', align, { viewport } )
					.assertComputedStyle( { [ MAIN_SELECTOR ]: { 'align-self': align } } )
			} )
		}

		if ( enableInnerBlockAlignment ) {
			if ( viewport === 'Desktop' ) {
				cy.adjust( 'Inner Block Alignment', 'horizontal' )
					.assertClassName( alignmentSelector, 'stk--block-orientation-horizontal' )
			}
		}

		if ( enableInnerBlockVerticalAlignment ) {
			const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
			verticalAligns.forEach( align => {
				cy.adjust( 'Inner Block Vertical Alignment', align, { viewport } )
					.assertComputedStyle( {
						'.block-editor-block-list__layout': {
							'align-items': align,
						},
					}, { assertFrontend: false } )

				cy.adjust( 'Inner Block Vertical Alignment', align, { viewport } )
					.assertComputedStyle( {
						[ alignmentSelector ]: {
							'align-items': align,
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
			cy.adjust( 'Background Color', '#ffff00', { state: 'hover' } )
			cy.adjust( 'Background Color Opacity', 0.8, { state: 'normal' } )
			cy.adjust( 'Background Color Opacity', 0.6, { state: 'hover' } )
				.assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'background-color': 'rgba( 99, 45, 45, 0.8 )',
					},
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

			cy.adjust( 'Background Media Tint Strength', 7, { state: 'normal' } )
			cy.adjust( 'Background Media Tint Strength', 4, { state: 'hover' } )
			cy.adjust( 'Fixed Background', true )
			cy.adjust( 'Adv. Background Image Settings', {
				'Image Blend Mode': 'hue',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'background-blend-mode': 'hue',
					'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
					'background-attachment': 'fixed',
				},
				[ `${ MAIN_SELECTOR }:before` ]: {
					'opacity': '0.7',
				},
				[ `${ MAIN_SELECTOR }:before:hover` ]: { // TODO: Support assertion of a pseudo class's hover state
					'opacity': '0.4',
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
			// Normal state - px unit
			cy.adjust( 'Min. Height', 387, {
				viewport, unit: 'px', state: 'normal',
			} )
			// Hover state - px unit
			cy.adjust( 'Min. Height', 491, {
				viewport, unit: 'px', state: 'hover',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'min-height': '387px',
				},
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'min-height': '491px',
				},
			} )
			cy.resetStyle( 'Min. Height', { viewport, state: 'normal' } )
			cy.resetStyle( 'Min. Height', { viewport, state: 'hover' } )

			// Normal state - vh unit
			cy.adjust( 'Min. Height', 53, {
				viewport, unit: 'vh', state: 'normal',
			} )
			// Hover state - vh unit
			cy.adjust( 'Min. Height', 37, {
				viewport, unit: 'vh', state: 'hover',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'min-height': '53vh',
				},
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'min-height': '37vh',
				},
			} )
			cy.resetStyle( 'Min. Height', { viewport, state: 'normal' } )
			cy.resetStyle( 'Min. Height', { viewport, state: 'hover' } )
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
			// Normal state - px unit
			cy.adjust( 'Max. Content Width', 819, {
				viewport, unit: 'px', state: 'normal',
			} )
			// Hover state - px unit
			cy.adjust( 'Max. Content Width', 521, {
				viewport, unit: 'px', state: 'hover',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'max-width': '819px',
					'min-width': 'auto',
				},
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'max-width': '521px',
					'min-width': 'auto',
				},
			} )
			cy.resetStyle( 'Max. Content Width', { viewport, state: 'normal' } )
			cy.resetStyle( 'Max. Content Width', { viewport, state: 'hover' } )

			// Normal state - % unit
			cy.adjust( 'Max. Content Width', 54, {
				viewport, unit: '%', state: 'normal',
			} )
			// Hover state - % unit
			cy.adjust( 'Max. Content Width', 38, {
				viewport, unit: '%', state: 'hover',
			} ).assertComputedStyle( {

			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'max-width': '54%',
					'min-width': 'auto',
				},
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'max-width': '38%',
					'min-width': 'auto',
				},
			} )
			// Reset only the hover state so we can adjust Content Horizontal Align
			cy.resetStyle( 'Max. Content Width', { viewport, state: 'hover' } )

			// Additional control added when Max. Content Width is adjusted:
			aligns.forEach( align => {
				cy.adjust( 'Content Horizontal Align', align, { viewport } )
					.assertComputedStyle( {
						[ MAIN_SELECTOR ]: {
							'justify-content': align,
						},
					} )
			} )
		}

		if ( enablePaddings ) {
			const states = [ 'hover', 'normal' ]
			const willAssertUnits = [
				{
					unit: 'px',
					hover: [ 141, 142, 143, 144 ],
					normal: [ 151, 152, 153, 154 ],
				},
				{
					unit: 'em',
					hover: [ 23, 24, 25, 26 ],
					normal: [ 19, 20, 21, 22 ],
				},
				{
					unit: '%',
					hover: [ 67, 68, 69, 70 ],
					normal: [ 77, 78, 79, 80 ],
				},
			]

			willAssertUnits.forEach( values => {
				states.forEach( state => {
					const valToAssert = state === 'hover' ? values.hover : values.normal

					cy.adjust( 'Paddings', valToAssert, {
						viewport, unit: values.unit, state,
					} ).assertComputedStyle( {
						[ `${ MAIN_SELECTOR }${ state === 'hover' ? ':hover' : '' }` ]: {
							'padding-top': `${ valToAssert[ 0 ] }${ values.unit }`,
							'padding-right': `${ valToAssert[ 1 ] }${ values.unit }`,
							'padding-bottom': `${ valToAssert[ 2 ] }${ values.unit }`,
							'padding-left': `${ valToAssert[ 3 ] }${ values.unit }`,
						},
					} )
				} )
			} )
		}

		if ( enableMargins ) {
			cy.adjust( 'Margins', [ 141, 142, 143, 144 ], {
				viewport, unit: 'px', state: 'normal',
			} )
			cy.adjust( 'Margins', [ 151, 152, 153, 154 ], {
				viewport, unit: 'px', state: 'hover',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'margin-top': '141px',
					'margin-right': '142px',
					'margin-bottom': '143px',
					'margin-left': '144px',
				},
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'margin-top': '151px',
					'margin-right': '152px',
					'margin-bottom': '153px',
					'margin-left': '154px',
				},
			} )

			cy.adjust( 'Margins', [ 67, 68, 69, 70 ], {
				viewport, unit: '%', state: 'normal',
			} )
			cy.adjust( 'Margins', [ 77, 78, 79, 80 ], {
				viewport, unit: '%', state: 'hover',
			} ).assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'margin-top': '67%',
					'margin-right': '68%',
					'margin-bottom': '69%',
					'margin-left': '70%',
				},
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'margin-top': '77%',
					'margin-right': '78%',
					'margin-bottom': '79%',
					'margin-left': '80%',
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
		}

		cy.adjust( 'Border Width', [ 11, 12, 13, 14 ], { viewport, state: 'normal' } )
		cy.adjust( 'Border Width', [ 7, 8, 9, 10 ], { viewport, state: 'hover' } )
			.assertComputedStyle( {
				[ MAIN_SELECTOR ]: {
					'border-top-width': '11px',
					'border-right-width': '12px',
					'border-bottom-width': '13px',
					'border-left-width': '14px',
				},
				[ `${ MAIN_SELECTOR }:hover` ]: {
					'border-top-width': '7px',
					'border-right-width': '8px',
					'border-bottom-width': '9px',
					'border-left-width': '10px',
				},
			} )

		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Border Color', '#0d00ff', { state: 'normal' } )
			cy.adjust( 'Border Color', '#b6c44f', { state: 'hover' } )
				.assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'border-color': '#0d00ff',
					},
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
			cy.adjust( 'Shadow / Outline', 8, { state: 'hover' } )
				.assertComputedStyle( {
					[ MAIN_SELECTOR ]: {
						'box-shadow': '0px 10px 30px rgba(0, 0, 0, 0.05)',
					},
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
			cy.getPostData().then( data => {
				cy.toggleStyle( 'Link' )
				cy.adjust( 'Link / URL', 'https://wpstackable.com/' ).assertHtmlAttribute( '.stk-block-link', 'href', 'https://wpstackable.com/', { assertBackend: false } )
				cy.resetStyle( 'Link / URL' )
				cy.adjust( 'Link / URL', {
					source: 'Current Post',
					fieldName: 'Post URL',
				}, {
					isDynamicContent: true,
				} ).assertHtmlAttribute( '.stk-block-link', 'href', data.link, { assertBackend: false } )
			} )

			cy.adjust( 'Open in new tab', true ).assertHtmlAttribute( '.stk-block-link', 'rel', /noreferrer noopener/, { assertBackend: false } )
			cy.adjust( 'Link rel', 'sponsored ugc' ).assertHtmlAttribute( '.stk-block-link', 'rel', /sponsored ugc/, { assertBackend: false } )
		}
	}
}

export const Block = new BlockModule()

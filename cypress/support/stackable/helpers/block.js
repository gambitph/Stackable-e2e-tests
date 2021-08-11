/**
 *
 * Assertion function for Block Tab.
 *
 * @param {string} selector
 * @param {Object} options
 */
export const assertBlockTab = ( selector, options = {} ) => {
	const {
		// disableColumnHeight = false,
		// disableColumnVerticalAlign = false,
		// disableBlockMargins = false,
		// disableBlockPaddings = false,
		// enableMarginTop = true,
		// enableMarginRight = true,
		// enableMarginBottom = true,
		// enableMarginLeft = true,
		// enablePaddingTop = true,
		// enablePaddingRight = true,
		// enablePaddingBottom = true,
		// enablePaddingLeft = true,
		// paddingUnits = [ 'px', 'em', '%' ],
		// marginUnits = [ 'px', '%' ],
		// verticalAlignSelector = null,
		viewport = 'Desktop',
		mainSelector = null,
		alignmentSelector = '',
	} = options

	const MAIN_SELECTOR = mainSelector || '.stk-block'
	selector = mainSelector || selector

	/**
	 * Only collapse when present.
	 *
	 * @param {string} collapseName
	 * @param {Function} callback
	 */
	const _collapse = ( collapseName = '', callback = () => {} ) => {
		cy.get( '.components-panel__body' )
			.first()
			.parent()
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

	const _assertBlockTab = ( viewport = 'Desktop' ) => {
		_collapse( 'Alignment', () => {
			// Test Alignment panel
			const aligns = [ 'left', 'center', 'right' ]
			aligns.forEach( align => {
				_adjust( 'Content Alignment', align, { viewport }, 'assertClassName', alignmentSelector, `has-text-align-${ align }` )
			} )

			const columnAligns = [ 'flex-start', 'center', 'flex-end', 'stretch' ]
			columnAligns.forEach( align => {
				_adjust( 'Column Alignment', align, { viewport }, 'assertComputedStyle', {
					[ MAIN_SELECTOR ]: {
						'align-self': align,
					},
				} )
			} )

			if ( viewport === 'Desktop' ) {
				_adjust( 'Inner Block Alignment', 'horizontal', {}, 'assertClassName', alignmentSelector, 'stk--block-orientation-horizontal' )
			}

			const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
			verticalAligns.forEach( align => {
				_adjust( 'Inner Block Vertical Alignment', align, { viewport }, 'assertComputedStyle', {
					'.block-editor-block-list__layout': {
						'align-items': align,
					},
				}, { assertFrontend: false } )
				_adjust( 'Inner Block Vertical Alignment', align, { viewport }, 'assertComputedStyle', {
					[ alignmentSelector ]: {
						'align-items': align,
					},
				}, { assertBackend: false } )
			} )
		} )

		_collapse( 'Background', () => {
			// Test Background Panel.
			// All options inside Background panel are the same, using `_adjust` is not necessary
			cy.toggleStyle( 'Background' )
			cy.setBlockAttribute( {
				[ `blockBackgroundMediaUrl${ viewport === 'Desktop' ? '' : viewport }` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
			} )

			if ( viewport === 'Desktop' ) {
				// Adjust single container color options.
				cy.adjust( 'Color Type', 'single' )
				cy.adjust( 'Background Color', '#ffff00', { state: 'Hover' } ).assertComputedStyle( {
					[ `${ selector }:hover` ]: {
						'background-color': '#ffff00',
					},
				} )
				cy.adjust( 'Background Color', '#632d2d', { state: 'Normal' } ).assertComputedStyle( {
					[ selector ]: {
						'background-color': 'rgb(99, 45, 45)',
					},
					[ `${ selector }:before` ]: {
						'background-color': '#632d2d',
					},
				} )

				// Adjust gradient container color options.
				cy.adjust( 'Color Type', 'gradient' )
				cy.adjust( 'Background Color #1', '#a92323' )
				cy.adjust( 'Background Color #2', '#404633' )
				cy.adjust( 'Adv. Gradient Color Settings', {
					'Gradient Direction (degrees)': 180,
					'Color 1 Location': 11,
					'Color 2 Location': 80,
					'Background Gradient Blend Mode': 'difference',
				} ).assertComputedStyle( {
					[ `${ selector }:before` ]: {
						'background-image': 'linear-gradient(180deg, #a92323 11%, #404633, 80%)',
						'mix-blend-mode': 'difference',
					},
				} )

				cy.adjust( 'Background Media Tint Strength', 8, { state: 'Hover' } ).assertComputedStyle( {
					[ `${ selector }:hover` ]: {
						'background-color': '#ffff00',
					},
				} )
				cy.adjust( 'Background Media Tint Strength', 5, { state: 'Normal' } )
				cy.adjust( 'Fixed Background', true )
				cy.adjust( 'Adv. Background Image Settings', {
					'Image Blend Mode': 'hue',
				} ).assertComputedStyle( {
					[ selector ]: {
						'background-blend-mode': 'hue',
						'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
						'background-attachment': 'fixed',
					},
					[ `${ selector }:before` ]: {
						'opacity': '0.5',
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
				[ selector ]: {
					'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
					'background-position': '50% 50%',
					'background-repeat': 'repeat-x',
					'background-size': '19%',
				},
			} )
		} )
	}

	_assertBlockTab( viewport )
}

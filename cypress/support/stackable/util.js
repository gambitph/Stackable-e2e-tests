/**
 * External dependencies
 */
import {
	first, last,
} from 'lodash'
import { containsRegExp } from '~common/util'

// TODO: Pass withInspectorTabMemory in gutenberg/util.js here

/**
 * Function for overwriting log argument.
 *
 * @param {Object} options
 */
export function modifyLogFunc( options = {} ) {
	const {
		position = 'last',
		argumentLength = false,
		additionalArgs = () => ( {} ),
	} = options

	if ( argumentLength ) {
		return function( originalFn, ...args ) {
			if ( args.length === argumentLength ) {
				const options = args.pop()
				options.log = Cypress.env( 'DEBUG' ) === 'true'
				originalFn( ...args, Object.assign( options, additionalArgs() || {} ) )
			}
			return originalFn( ...args, Object.assign( { log: Cypress.env( 'DEBUG' ) === 'true' }, additionalArgs() || {} ) )
		}
	}

	return function( originalFn, ...args ) {
		const firstOrLast = position === 'last' ? last : first
		if ( typeof firstOrLast( args ) === 'object' && ! Array.isArray( firstOrLast( args ) ) ) {
			const options = args[ position === 'last' ? 'pop' : 'shift' ]()
			options.log = Cypress.env( 'DEBUG' ) === 'true'
			return position === 'last' ? originalFn( ...args, options ) : originalFn( options, ...args )
		}
		return position === 'last'
			? 			originalFn( ...args, { log: Cypress.env( 'DEBUG' ) === 'true' } )
			: 			originalFn( { log: Cypress.env( 'DEBUG' ) === 'true' }, ...args )
	}
}

/**
 * Function for changing the unit in control.
 *
 * @param {Object} options
 */
export function changeUnit( options = {} ) {
	const {
		unit = '',
		name = '',
	} = options
	if ( ! elementContainsText( Cypress.$( '.components-base-control' ), name ) ) {
		return
	}

	const selector = () => cy.getBaseControl( name, options )

	if ( unit ) {
		selector()
			.then( $baseControl => {
				if ( $baseControl.find( '.stk-control-label__units' ).length ) {
					selector().find( '.stk-control-label__units button.is-active' ).invoke( 'attr', 'data-value' ).then( value => {
						if ( value !== unit ) {
							// Change the unit only if the selected unit is not the active unit.
							selector().find( '.stk-control-label__units button.is-active' ).click( { force: true } )
							selector().find( `.stk-control-label__units button[data-value="${ unit }"]` ).click( { force: true } )
						}
					} )
				}

				if ( $baseControl.find( '.ugb-base-control-multi-label__units', { log: false } ).length ) {
					selector()
						.find( 'button', { log: false } )
						.contains( containsRegExp( unit ) )
						.click( { force: true, log: false } )
				}
			} )
	}
}

/**
 * Function for changing the viewport in control
 *
 * @param {Object} options
 */
export function changeControlViewport( options = {} ) {
	const {
		viewport = 'Desktop',
		name = '',
	} = options
	if ( ! elementContainsText( Cypress.$( '.components-base-control' ), name ) ) {
		return
	}

	const selector = () => cy.getBaseControl( name, options )
	selector()
		.then( $baseControl => {
			if ( $baseControl.find( '.stk-control-responsive-toggle button.is-active' ).length ) {
				selector().find( '.stk-control-responsive-toggle button.is-active' ).invoke( 'attr', 'aria-label' ).then( value => {
					if ( value !== viewport ) {
						// Change the viewport only if the selected viewport is not the active viewport.
						selector().find( '.stk-control-responsive-toggle button.is-active' ).click( { force: true } )
						selector()
							.find( '.stk-control-responsive-toggle' )
							.invoke( 'attr', 'aria-expanded' )
							.then( ariaExpanded => {
								if ( ariaExpanded === 'true' ) {
									selector()
										.find( `button[aria-label="${ viewport }"]` )
										.click( { force: true, log: false } )
								}
							} )
					}
				} )
			}

			if ( $baseControl.find( 'button[aria-label="Desktop"]' ).length ) {
				const hovered = $baseControl.find( 'button[aria-label="Tablet"]' ).length
				const hover = () => selector().find( 'button[aria-label="Desktop"]' ).trigger( 'mouseover', { force: true } )
				const selectViewport = () => selector().find( `button[aria-label="${ viewport }"]` ).click( { force: true } )
				const isActive = () => $baseControl.find( `button.is-active[aria-label="${ viewport }"]` ).length
				if ( viewport !== 'Desktop' ) {
					if ( ! hovered ) {
						hover()
						selectViewport()
					} else if ( ! isActive() ) {
						selectViewport()
					}
				} else if ( hovered ) {
					selectViewport()
				}
				cy.wait( 1 )
			}
		} )
}

/**
 * Function for checking if text exists within a DOM element in a recursive manner
 *
 * @param {jQuery} $parentElement DOM element to be searched
 * @param {string} textToMatch text being searched in element
 *
 * @return {boolean} true if it contains text to be matched and false if it doesn't
 */
export function elementContainsText( $parentElement = Cypress.$( 'body' ), textToMatch = '' ) {
	function _compareTextsRecursive( element ) {
		if ( ! element.children().length ) {
			return element.text().trim().match( containsRegExp( textToMatch ) )
		}
		return !! element.children().filter( function() {
			const childEl = Cypress.$( this )
			const childElText = childEl.clone().children().remove().end().text().trim()
			return childElText.match( containsRegExp( textToMatch ) ) || _compareTextsRecursive( childEl )
		} ).length
	}

	return !! $parentElement.filter( function() {
		return _compareTextsRecursive( Cypress.$( this ) )
	} ).length
}

/**
 * Function for changing the hover state in control
 *
 * @param {Object} options
 */
export function changeControlState( options = {} ) {
	const {
		state = 'normal',
		name = '',
	} = options
	if ( ! elementContainsText( Cypress.$( '.components-base-control' ), name ) ) {
		return
	}

	let currentState
	cy.wp().then( wp => {
		currentState = wp.data.select( 'stackable/hover-state' ).getHoverState()
	} )

	const selector = () => cy.getBaseControl( name, options )
	selector()
		.then( $baseControl => {
			if ( $baseControl.find( `.stk-control-label__toggles .stk-label-unit-toggle button[data-value="${ state }"]` ).length ) {
				if ( currentState !== state ) {
					// Change the state only if the selected state is not the active state.
					selector().find( '.stk-control-label__toggles .stk-label-unit-toggle button.is-active' ).click( { force: true, multiple: true } )
					selector()
						.find( '.stk-control-label__toggles .stk-label-unit-toggle' )
						.invoke( 'attr', 'aria-expanded' )
						.then( ariaExpanded => {
							if ( ariaExpanded === 'true' ) {
								selector()
									.find( `.stk-control-label__toggles .stk-label-unit-toggle button[data-value="${ state }"]` )
									.click( { force: true, log: false } )
							}
						} )
				}
			}
		} )
}

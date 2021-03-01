/**
 * External dependencies
 */
import {
	first, last, lowerCase,
} from 'lodash'
import { containsRegExp } from '~common/util'

/**
 * Function for overwriting log argument.
 *
 * @param {Object} options
 */
export function modifyLogFunc( options = {} ) {
	const {
		position = 'last',
		argumentLength = false,
	} = options

	if ( argumentLength ) {
		return function( originalFn, ...args ) {
			if ( args.length === argumentLength ) {
				const options = args.pop()
				options.log = Cypress.env( 'DEBUG' ) === 'true'
				originalFn( ...args, options )
			}
			return originalFn( ...args, { log: Cypress.env( 'DEBUG' ) === 'true' } )
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
 * @param {string} unit desired unit
 * @param {string} name selector name
 * @param {boolean} isInPopover if the control is in popover
 */
export function changeUnit( unit = '', name = '', isInPopover = false ) {
	if ( ! Cypress.$( '.components-base-control' ).filter( function() {
		return containsRegExp( name ).test( Cypress.$( this ).text() )
	} )[ 0 ] ) {
		return
	}

	const selector = () => cy.getBaseControl( name, { isInPopover } )

	if ( unit ) {
		selector()
			.then( $baseControl => {
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
 * @param {string} viewport desired viewport
 * @param {string} name selector name
 * @param {boolean} isInPopover if the control is in popover
 */
export function changeControlViewport( viewport = 'Desktop', name = '', isInPopover = false ) {
	if ( ! Cypress.$( '.components-base-control' ).filter( function() {
		return containsRegExp( name ).test( Cypress.$( this ).text() )
	} )[ 0 ] ) {
		return
	}

	const selector = () => cy.getBaseControl( name, { isInPopover } )
	selector()
		.then( $baseControl => {
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
 * Function for getting the active tab
 * in inspector.
 *
 * @param {Function} callback callback function
 */
export function getActiveTab( callback = () => {} ) {
	cy
		.get( '.ugb-panel-tabs__wrapper>button.edit-post-sidebar__panel-tab.is-active', { log: false } )
		.invoke( 'attr', 'aria-label' )
		.then( ariaLabel => {
			// Get the active tab.
			const tab = lowerCase( first( ariaLabel.split( ' ' ) ) )

			callback( tab )
		} )
}

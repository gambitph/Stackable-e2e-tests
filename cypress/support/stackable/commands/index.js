/**
 * Internal dependencies
 */
import { modifyLogFunc } from '../util'

/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'get', modifyLogFunc() )
Cypress.Commands.overwrite( 'click', modifyLogFunc() )
Cypress.Commands.overwrite( 'type', modifyLogFunc() )
Cypress.Commands.overwrite( 'reload', modifyLogFunc() )
Cypress.Commands.overwrite( 'document', modifyLogFunc() )
Cypress.Commands.overwrite( 'window', modifyLogFunc() )
Cypress.Commands.overwrite( 'trigger', modifyLogFunc() )
Cypress.Commands.overwrite( 'invoke', modifyLogFunc( { position: 'first' } ) )
Cypress.Commands.overwrite( 'eq', modifyLogFunc() )
Cypress.Commands.overwrite( 'first', modifyLogFunc() )
Cypress.Commands.overwrite( 'wait', modifyLogFunc() )
Cypress.Commands.overwrite( 'contains', modifyLogFunc() )
Cypress.Commands.overwrite( 'last', modifyLogFunc() )
Cypress.Commands.overwrite( 'wrap', modifyLogFunc( { argumentLength: 2 } ) )
Cypress.Commands.overwrite( 'closest', modifyLogFunc() )

/**
 * Custom Comands for Stackable.
 */
import './setup'
import './assertions'
import './controls'
import './editor'
import './global-settings'
import './inspector'
import './toolbar'
import './settings'

/**
 * External dependencies
 */
import { isFunction } from 'lodash'

/**
 * Module Class for Stackable v3 Blocks.
 *
 * Responsible for defining and storing
 * modules for specific stackable inspector
 * tab.
 *
 * @since 3.0.0
 */
class Module {
	constructor() {
		this.registeredTests = {}
		this.moduleName = ''
	}

	setModuleName( name ) {
		this.moduleName = name
	}

	/**
	 *
	 * Helper function for registering
	 * a test
	 *
	 * @param {string} panelName
	 * @param {Function} fn
	 */
	registerTest( panelName = '', fn = () => {} ) {
		this.registeredTests[ panelName ] = ( ...args ) => {
			cy.collapse( panelName )
			fn( ...args )
		}
	}

	/**
	 * Function that acts as
	 * a tests picker.
	 *
	 * @param {Array} namespaces
	 */
	includes( namespaces = [] ) {
		const self = this
		namespaces.forEach( namespace => {
			if ( ! self.registeredTests[ namespace ] ) {
				throw new Error( `${ namespace } is not registered inside the Module class. Define ${ namespace } by adding \`this.registerTest()\`.` )
			}
		} )
		return {
			run: () => self.run( ...namespaces ),
		}
	}

	/**
	 * Used for running all registere tests
	 */
	all() {
		const self = this
		return {
			run: () => self.run( ...Object.keys( self.registeredTests ) ),
		}
	}

	/**
	 * Given an array of panel names,
	 * run the tests.
	 *
	 * @param {Array<string>} namespaces
	 */
	run( ...namespaces ) {
		if ( ! namespaces.length ) {
			return
		}

		const self = this
		namespaces.forEach( namespace => {
			if ( ! isFunction( self.registeredTests[ namespace ] ) ) {
				throw new Error( `${ namespace } is not a valid test function.` )
			}

			it( `should assert ${ namespace } inside the ${ self.moduleName }`, self.registeredTests[ namespace ] )
		} )
	}
}

export default Module

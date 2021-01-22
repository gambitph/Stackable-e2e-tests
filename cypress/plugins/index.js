/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
const webpack = require( '@cypress/webpack-preprocessor' )

module.exports = on => {
	on( `task`, {
		error( message ) {
			console.error( message ) // eslint-disable-line no-console
			return null
		},
	} )

	on( `file:preprocessor`, webpack( {
		webpackOptions: require( '../../webpack.conf.js' ),
		watchOptions: {},
	} ) )
}

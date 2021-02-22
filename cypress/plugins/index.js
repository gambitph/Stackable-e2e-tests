/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
const webpack = require( '@cypress/webpack-preprocessor' )
const stackableTestConfig = require( './stackable-config' )

module.exports = ( on, config ) => {
	on( 'file:preprocessor', webpack( {
		webpackOptions: require( '../../webpack.conf.js' ),
		watchOptions: {},
	} ) )

	return stackableTestConfig( on, config )
}

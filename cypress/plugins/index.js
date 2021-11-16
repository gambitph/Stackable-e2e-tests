/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
const webpack = require( '@cypress/webpack-preprocessor' )
const {
	addMatchImageSnapshotPlugin,
} = require( 'cypress-image-snapshot/plugin' )

module.exports = ( on, config ) => {
	on( 'file:preprocessor', webpack( {
		webpackOptions: require( '../../webpack.conf.js' ),
		watchOptions: {},
	} ) )
	addMatchImageSnapshotPlugin( on, config )

	return config
}

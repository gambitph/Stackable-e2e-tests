/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
const webpack = require( '@cypress/webpack-preprocessor' )
const path = require( 'path' )
const { compact } = require( 'lodash' )

module.exports = ( on, config ) => {
	on( `file:preprocessor`, webpack( {
		webpackOptions: require( '../../webpack.conf.js' ),
		watchOptions: {},
	} ) )

	if ( config.env.DEBUG === 'false' ) {
		config.env.CYPRESS_NO_COMMAND_LOG = 1
	}

	if ( config.env.forceIncludeAllTests === 'false' ) {
		const includeV2TestFiles = config.env.includedV2TestFiles.length && path.join( config.integrationFolder, 'v2', '**', `!(?(${ config.env.includedV2TestFiles.join( '|' ) })).spec.js` )
		const includeV3TestFiles = config.env.includedV3TestFiles.length && path.join( config.integrationFolder, 'v3', '**', `!(?(${ config.env.includedV3TestFiles.join( '|' ) })).spec.js` )

		const includeTestFiles = compact( [ includeV2TestFiles, includeV3TestFiles ] ) || []
		config.ignoreTestFiles = includeTestFiles.length > 1
			? `{${ includeTestFiles.join( ',' ) }}`
			: 		includeTestFiles.join( ',' )
		return config
	}
}

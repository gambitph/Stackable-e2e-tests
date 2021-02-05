/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
const webpack = require( '@cypress/webpack-preprocessor' )
const path = require( 'path' )
const { compact } = require( 'lodash' )

// Force all files to be included for debugging.
const FORCE_INCLUDE_ALL = false

const INCLUDE_V2_TEST_FILES = [
	// Blocks
	'accordion',
	'blockqoute',
	'cta',
	'divider',
	'header',
	'heading',
	'icon-list',
	'spacer',
	'text',
]

const INCLUDE_V3_TEST_FILES = []

module.exports = ( on, config ) => {
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

	if ( ! FORCE_INCLUDE_ALL ) {
		const includeV2TestFiles = INCLUDE_V2_TEST_FILES.length && path.join( config.integrationFolder, 'v2', '**', `!(?(${ INCLUDE_V2_TEST_FILES.join( '|' ) })).spec.js` )
		const includeV3TestFiles = INCLUDE_V3_TEST_FILES.length && path.join( config.integrationFolder, 'v3', '**', `!(?(${ INCLUDE_V3_TEST_FILES.join( '|' ) })).spec.js` )

		const includeTestFiles = compact( [ includeV2TestFiles, includeV3TestFiles ] ) || []
		config.ignoreTestFiles = includeTestFiles.length > 1
			? `{${ includeTestFiles.join( ',' ) }}`
			: 		includeTestFiles.join( ',' )
		return config
	}
}

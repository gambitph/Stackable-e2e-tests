const path = require( 'path' )
const { compact } = require( 'lodash' )

/**
 * Use Cypress environment variables to
 * generate our own `ignoreTestFiles` config.
 * Only include passing tests.
 *
 * @param {Function} on
 * @param {Cypress.PluginConfig} config
 */
const stackableTestConfig = ( on, config ) => {
	// Only get included glob patterns when FORCE_INCLUDE_ALL_TESTS is false.
	if ( config.env.FORCE_INCLUDE_ALL_TESTS === 'false' ) {
		// Generate glob pattern for included v2 blocks.
		const includeV2TestFiles =
			config.env.INCLUDED_V2_TEST_FILES.length &&
			path.join(
				config.integrationFolder,
				'v2',
				'**',
				`!(?(${ config.env.INCLUDED_V2_TEST_FILES.join( '|' ) })).spec.js`
			)
		// Generate glob pattern for included v3 blocks.
		const includeV3TestFiles =
			config.env.INCLUDED_V3_TEST_FILES.length &&
			path.join(
				config.integrationFolder,
				'v3',
				'**',
				`!(?(${ config.env.INCLUDED_V3_TEST_FILES.join( '|' ) })).spec.js`
			)

		const includeTestFiles = compact( [ config.ignoreTestFiles, includeV2TestFiles, includeV3TestFiles ] ) || []
		// Overwrite ignoreTestFiles
		config.ignoreTestFiles =
			includeTestFiles.length > 1
				? `{${ includeTestFiles.join( ',' ) }}`
				: includeTestFiles.join( ',' )

		return config
	}
}

module.exports = stackableTestConfig

const path = require( 'path' )

module.exports = {
	resolve: {
		alias: {
			'~common': path.resolve( __dirname, 'cypress/support' ),
			'~stackable-e2e': path.resolve( __dirname, 'cypress/support/stackable' ),
			'~wordpress-e2e': path.resolve( __dirname, 'cypress/support/wordpress' ),
			'~gutenberg-e2e': path.resolve( __dirname, 'cypress/support/gutenberg' ),
			'root': path.resolve( __dirname, './' ),
		},
	},
}

const path = require( 'path' )

module.exports = {
	resolve: {
		alias: {
			[ `~stackable-e2e` ]: path.resolve( __dirname, 'cypress/support' ),
		},
	},
}

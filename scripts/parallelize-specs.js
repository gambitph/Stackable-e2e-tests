/* eslint-disable */
const glob = require( 'glob' )
const { chunk, trim } = require( 'lodash' )
const config = require( '../cypress.json' )
const cypress = require( 'cypress' )

/**
 * Function for splitting the spec files based on the number of
 * expected machines which will run the tests.
 *
 * @param {Object} args
 */
function parallelizeSpecs( args ) {
	glob( args.spec, {}, function( err, files ) {
		const splitFiles = chunk( files, Math.ceil( files.length / args[ 'total-machines' ] ) )[ args[ 'machine-number' ] - 1 ]
		const env = config.env
		if ( args.env ) {
			Object.assign( env, args.env.split( ',' ).reduce( ( curr, acc ) => {
				const [ key, value ] = curr
				return Object.assign( acc, { [ key ]: trim( value, '"' ) } )
			}, {} ) )
		}
		cypress.run( {
			browser: args.browser || 'electron',
			spec: splitFiles.join( ',' ),
			config: {
				baseUrl: args.baseUrl || config.baseUrl,
				video: !! args.video,
			},
			env,
		} )
	} )
}

const args = require( 'args-parser' )( process.argv )

parallelizeSpecs( args )
/* eslint-enable */

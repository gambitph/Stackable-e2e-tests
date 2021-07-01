/**
 * Helper function for registering tests.
 *
 * @param {Array} testsList
 * @param {Function} onTestsStart
 */
export const registerTests = ( testsList = [], onTestsStart = () => {} ) => {
	beforeEach( () => {
		cy.wrap( [] ).as( 'blockSnapshotBlocks' )
	} )
	onTestsStart()
	testsList.forEach( test => typeof test === 'function' && test() )
}

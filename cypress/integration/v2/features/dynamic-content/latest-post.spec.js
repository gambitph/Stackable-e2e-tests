
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content - Latest Post', registerTests( [
	matchSiteData,
	adjustFieldOptions,
	adjustFieldValues,
] ) )

/*
const fields = {
    'Post Title',
    'Po'
 }
 */
//const nthLatest = [ '' ]
/*
const adjustField = ( fieldName, fieldOptions = {} ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Latest Post',
		fieldName,
		fieldOptions,
	} )
}
*/
function matchSiteData() {
	it( 'should match dynamic content in site fields', () => {
		cy.setupWP()
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all fields with options', () => {
		cy.setupWP()
	} )
}
//site URL was excluded for this test, since it cannot be changed
function adjustFieldValues() {
	it( 'should assert changes to the field values', () => {
		cy.setupWP()
	} )
}


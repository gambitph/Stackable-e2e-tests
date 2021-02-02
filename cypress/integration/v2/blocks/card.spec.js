/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Card Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/card', '.ugb-card' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/card' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/card', [
		'Basic',
		'Plain',
		'Horizontal',
		'Full',
		'Faded',
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/card', [
		'Angled Card',
		'Arch Card',
		'Aspire Card',
		'Aurora Card',
		'Bean Card',
		'Capital Card',
		'Cary Card 1',
		'Cary Card 2',
		'Chic Card',
		'Decora Card',
		'Detour Card',
		'Devour Card',
		'Dim Card',
		'Dustin Card',
		'Glow Card',
		'Heights Card',
		'Hue Card',
		'Lounge Card',
		'Lush Card',
		'Peplum Card',
		'Prime Card',
		'Speck Card',
		'Yule Card',
	] ) )
}


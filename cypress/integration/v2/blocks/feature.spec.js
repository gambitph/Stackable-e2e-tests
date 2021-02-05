/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Feature Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/feature', '.ugb-feature' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/feature' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/feature', [
		{ value: 'Basic', selector: '.ugb-feature--design-basic' },
		{ value: 'Plain', selector: '.ugb-feature--design-plain' },
		{
			value: 'half',
			selector: '.ugb-feature--design-half',
		},
		{
			value: 'overlap',
			selector: '.ugb-feature--design-overlap',
		},
		{
			value: 'overlap2',
			selector: '.ugb-feature--design-overlap2',
		},
		{
			value: 'overlap3',
			selector: '.ugb-feature--design-overlap3',
		},
		{
			value: 'overlap4',
			selector: '.ugb-feature--design-overlap4',
		},
		{
			value: 'overlap5',
			selector: '.ugb-feature--design-overlap5',
		},
		{
			value: 'overlap-bg',
			selector: '.ugb-feature--design-overlap-bg',
		},
		{
			value: 'overlap-bg2',
			selector: '.ugb-feature--design-overlap-bg2',
		},
		{
			value: 'overlap-bg3',
			selector: '.ugb-feature--design-overlap-bg3',
		},
		{
			value: 'overlap-bg4',
			selector: '.ugb-feature--design-overlap-bg4',
		},
		{
			value: 'overlap-bg5',
			selector: '.ugb-feature--design-overlap-bg5',
		},
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/feature', [
		'Angled Feature',
		'Arch Feature',
		'Aspire Feature 2',
		'Aspire Feature',
		'Aurora Feature',
		'Bean Feature 1',
		'Bean Feature 2',
		'Capital Feature',
		'Cary Feature',
		'Chic Feature',
		'Dare Feature',
		'Decora Feature',
		'Detour Feature',
		'Dim Feature',
		'Dustin Feature',
		'Elevate Feature',
		'Flex Feature',
		'Glow Feature',
		'Heights Feature',
		'Hue Feature',
		'Lounge Feature',
		'Lush Feature',
		'Peplum Feature',
		'Prime Feature',
		'Proact Feature',
		'Seren Feature',
		'Speck Feature',
		'Upland Feature',
	] ) )
}


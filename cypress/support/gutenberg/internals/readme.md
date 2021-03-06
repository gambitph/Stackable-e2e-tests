## Plugins

### blockSnapshots.js

-   `wp.blocks.getBlockContent` can be used to generate block HTML content. With this, we can overwrite `getComputedStyle` to stub all generated HTML contents and CSS objects for future assertions.

Usage:

```jsx
function desktopStyles( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/accordion' ).asBlock( 'accordionBlock', { isStatic: true } )

	// More tests...
	// All assertion commands will no longer assert the frontend every call.
	// Instead, block snapshots will be stubbed and can be enqueued before the end of the test

 	// Enqueue all block snapshots and assert frontend styles
 	cy.assertFrontendStyles( '@accordionBlock' )
	// Alternatively, you can chain it after `selectBlock` command.
 	cy.selectBlock( 'ugb/accordion' ,'@accordionBlock' ).assertFrontendStyles()
}
```

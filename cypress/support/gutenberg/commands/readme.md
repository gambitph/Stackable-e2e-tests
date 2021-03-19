## Commands

### assertions.js

1. assertComputedStyle

    - Command for asserting the computed style of a block both in backend and frontend

    Syntax:

    ```jsx
    .assertComputedStyle( cssObject )
    .assertComputedStyle( cssObject, options )
    .assertComputedStyle( subject, cssObject, options )
    ```

    Arguments:

    - subject - jQuery Object
    - cssObject - Object
    - options - Object

    Options:

    | Option              | Data type   | Default value | Description                                                                     |
    | ------------------- | ----------- | ------------- | ------------------------------------------------------------------------------- |
    | assertFrontend      | boolean     | true          | Asserts the computed style in frontend                                          |
    | assertBackend       | boolean     | true          | Asserts the computed style in backend                                           |
    | delay               | int         | 0             | Amount of time to wait before asserting in backend & frontend (in milliseconds) |
    | viewportFrontend    | string, int | false         | Control the size of the screen to assert in Frontend                            |
    | afterFrontendAssert | function    | () => {}      | Function to call after frontend assertion                                       |
    | afterBackendAssert  | function    | () => {}      | Function to call after backend assertion                                        |

    Usage:

    ```jsx
    cy.adjust("Title Color", "#ff7979").assertComputedStyle({
    	".ugb-accordion__title": { color: "#ff7979" },
    });
    ```

    Rules/Requirements:

    - `.assertComputedStyle()` requires being chained off to commands such as `cy.adjust()`

2. assertClassName

    - Command for asserting the class names of an element in a block in both the frontend and backend

    Syntax

    ```jsx
    .assertClassName( customSelector, expectedValue )
    .assertClassName( customSelector, expectedValue, options )
    .assertClassName( subject, customSelector, expectedValue, options )
    ```

    Arguments:

    - subject - jQuery Object
    - customSelector - string
    - expectedValue - string
    - options - Object

    Options:

    | Option              | Data type | Default value | Description                                                                     |
    | ------------------- | --------- | ------------- | ------------------------------------------------------------------------------- |
    | assertBackend       | boolean   | true          | Asserts the computed style in backend                                           |
    | assertFrontend      | boolean   | true          | Asserts the computed style in frontend                                          |
    | delay               | int       | 0             | Amount of time to wait before asserting in backend & frontend (in milliseconds) |
    | afterFrontendAssert | function  | () => {}      | Function to call after frontend assertion                                       |
    | afterBackendAssert  | function  | () => {}      | Function to call after backend assertion                                        |

    Usage:

    ```jsx
    cy.adjust("Full Height", true).assertClassName(
    	".ugb-header__item",
    	"ugb--full-height"
    );
    ```

    Rules/Requirements:

    - `.assertClassName()` requires being chained off to commands such as `cy.adjust()`

3. assertHtmlTag

    - Command for asserting the html tag of an element in a block in both the frontend and backend

    Syntax

    ```jsx
    .assertHtmlTag( customSelector, expectedValue )
    .assertHtmlTag( customSelector, expectedValue, options )
    .assertHtmlTag( subject, customSelector, expectedValue, options )
    ```

    Arguments:

    - subject - jQuery Object
    - customSelector - string
    - expectedValue - string
    - options - Object

    Options:

    | Option              | Data type | Default value | Description                                                                     |
    | ------------------- | --------- | ------------- | ------------------------------------------------------------------------------- |
    | assertBackend       | boolean   | true          | Asserts the computed style in backend                                           |
    | assertFrontend      | boolean   | true          | Asserts the computed style in frontend                                          |
    | delay               | int       | 0             | Amount of time to wait before asserting in backend & frontend (in milliseconds) |
    | afterFrontendAssert | function  | () => {}      | Function to call after frontend assertion                                       |
    | afterBackendAssert  | function  | () => {}      | Function to call after backend assertion                                        |

    Usage:

    ```jsx
    cy.adjust("Title HTML Tag", "h4").assertHtmlTag(
    	".ugb-heading__title",
    	"h4"
    );
    ```

    Rules/Requirements:

    - `.assertHtmlTag()` requires being chained off to commands such as `cy.adjust()`

4. assertHtmlAttribute

    - Command for asserting the html attributes of an element in a block in both the frontend and backend

    Syntax

    ```jsx
    .assertHtmlAttribute( customSelector, attribute, expectedValue )
    .assertHtmlAttribute( customSelector, attribute, expectedValue, options )
    .assertHtmlAttribute( subject, customSelector, attribute, expectedValue, options )
    ```

    Arguments:

    - subject - jQuery Object
    - customSelector - string
    - attribute - string
    - expectedValue - string
    - options - Object

    Options:

    | Option              | Data type | Default value | Description                                                                     |
    | ------------------- | --------- | ------------- | ------------------------------------------------------------------------------- |
    | assertBackend       | boolean   | true          | Asserts the computed style in backend                                           |
    | assertFrontend      | boolean   | true          | Asserts the computed style in frontend                                          |
    | delay               | int       | 0             | Amount of time to wait before asserting in backend & frontend (in milliseconds) |
    | afterFrontendAssert | function  | () => {}      | Function to call after frontend assertion                                       |
    | afterBackendAssert  | function  | () => {}      | Function to call after backend assertion                                        |

    Usage:

    ```jsx
    cy.adjust(
    	"Alt Text (Alternative Text)",
    	"Hello World!"
    ).assertHtmlAttribute(".ugb-img", "alt", "Hello World!");
    ```

    Rules/Requirements:

    - `.assertHtmlAttribute()` requires being chained off to commands such as `cy.adjust()`

5. assertBlockContent

    - Command for asserting the text content of an element in a block in both the frontend and backend

    Syntax

    ```jsx
    .assertBlockContent( customSelector, expectedValue )
    .assertBlockContent( customSelector, expectedValue, options )
    .assertBlockContent( subject, customSelector, expectedValue, options )
    ```

    Arguments:

    - subject - jQuery Object
    - customSelector - string
    - expectedValue - string
    - options - Object

    Options:

    | Option              | Data type | Default value | Description                                                                     |
    | ------------------- | --------- | ------------- | ------------------------------------------------------------------------------- |
    | assertBackend       | boolean   | true          | Asserts the computed style in backend                                           |
    | assertFrontend      | boolean   | true          | Asserts the computed style in frontend                                          |
    | delay               | int       | 0             | Amount of time to wait before asserting in backend & frontend (in milliseconds) |
    | afterFrontendAssert | function  | () => {}      | Function to call after frontend assertion                                       |
    | afterBackendAssert  | function  | () => {}      | Function to call after backend assertion                                        |

    Usage:

    ```jsx
    cy.typeBlock(
    	"ugb/pricing-box",
    	".ugb-pricing-box__title",
    	"Hello World! 1"
    ).assertBlockContent(".ugb-pricing-box__title", "Hello World! 1");
    ```

    Rules/Requirements:

    - `.assertBlockContent()` requires being chained off to commands such as `cy.typeBlock()`

---

### attributes.js

1. setBlockAttribute

    - Command for setting attributes of a block

    Syntax:

    ```jsx
    .setBlockAttribute( attributes )
    .setBlockAttribute( attributes, clientId )
    ```

    Arguments:

    - attributes - Object
    - clientId - string

    Usage:

    ```jsx
    cy.setBlockAttribute({
    	videoLink: Cypress.env("DUMMY_VIDEO_URL"),
    });
    ```

2. getBlockAttributes

    - Command for getting all the attributes of a block

    Syntax:

    ```jsx
    .getBlockAttributes()
    .getBlockAttributes( clientId )
    ```

    Arguments

    - clientId - string

    Usage:

    ```jsx
    cy.getBlockAttributes().then((attributes) => {
    	// access block attributes
    });
    ```

---

### blocks.js

1. assertBlockError

    - Command for asserting block error

    Syntax:

    ```jsx
    .assertBlockError()
    ```

    Usage:

    ```jsx
    cy.assertBlockError();
    ```

2. addBlock

    - Command for adding a specific block in the inserter button to the editor

    Syntax:

    ```jsx
    .addBlock( blockName )
    ```

    Arguments:

    - blockName - string

    Usage:

    ```jsx
    cy.addBlock("ugb/columns");
    ```

3. selectBlock

    - Command for selecting a specific block in the editor

    Syntax:

    ```jsx
    .selectBlock( subject )
    .selectBlock( subject, selector )
    ```

    - subject - string
    - selector - string, number, Object

    Usage:

    ```jsx
    cy.selectBlock("ugb/column");
    ```

4. typeBlock

    - Command for typing text into block elements in the editor

    Syntax:

    ```jsx
    .typeBlock( subject, contentSelector, content )
    .typeBlock( subject, contentSelector, content, customSelector )
    ```

    Arguments:

    - subject - string
    - contentSelector - string
    - content - string
    - customSelector - string

    Usage:

    ```jsx
    cy.typeBlock("ugb/card", ".ugb-card__title", "Hello World! 1");
    ```

5. deleteBlock

    - Command for deleting a specific block

    Syntax:

    ```jsx
    .deleteBlock( subject )
    .deleteBlock( subject, selector )
    ```

    Arguments:

    - subject - string
    - selector - string

    Usage:

    ```jsx
    cy.deleteBlock("ugb/accordion", "Accordion 3");
    ```

6. addInnerBlock

    - Command for adding inner block (block inside another block) using block appender

    Syntax:

    ```jsx
    .addInnerBlock( blockName, blockToAdd )
    .addInnerBlock( blockName, blockToAdd, customSelector )
    ```

    Arguments:

    - blockName - string
    - blockToAdd - string
    - customSelector - string

    Usage:

    ```jsx
    cy.addInnerBlock("ugb/container", "ugb/card");
    ```

---

### controls.js

1.  colorControlClear

    -   Command for resetting the color picker

    Syntax:

    ```jsx
    .colorControlClear( name )
    .colorControlClear( name, options )
    ```

    Arguments:

    -   name - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.colorControlClear("Title Color");
    ```

2.  rangeControlReset

    -   Command for resetting the advanced range control

    Syntax:

    ```jsx
    .rangeControlReset( name )
    .rangeControlReset( name, options )
    ```

    Arguments:

    -   name - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.rangeControlReset("Size");
    ```

3.  dropdownControl

    -   Command for adjusting the dropdown control

    Syntax:

    ```jsx
    .dropdownControl( name, value )
    .dropdownControl( name, value, options)
    ```

    Arguments:

    -   name - string
    -   value - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.dropdownControl("Image Size", "large");
    ```

4.  colorControl

    -   Command for adjusting the color picker

    Syntax:

    ```jsx
    .colorControl( name, value )
    .colorControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - string, numbe
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.colorControl("Subtitle Color", "#00FF00");
    ```

5.  rangeControl

    -   Command for adjusting the advanced range control

    Syntax:

    ```jsx
    .rangeControl( name, value )
    .rangeControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - number
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.rangeControl("Size", 40);
    ```

6.  toolbarControl

    -   Command for adjusting the toolbar control

    Syntax:

    ```jsx
    .toolbarControl( name, value )
    .toolbarControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.toolbarControl("Title HTML Tag", "h4");
    ```

7.  toggleControl

    -   Command for enabling/disabling a toggle control

    Syntax:

    ```jsx
    .toggleControl( name, value )
    .toggleControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - boolean
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.toggleControl("Reverse arrow", true);
    ```

8.  textControl

    -   Command for adjusting the text control

    Syntax:

    ```jsx
    .textControl( name, value )
    .textControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.textControl("Number 1 Label", "100");
    ```

9.  textAreaControl

    -   Command for typing into a text area control

    Syntax:

    ```jsx
    .textAreaControl( name, value )
    .textAreaControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | isInPopover  | boolean   | true          | If the control is in popover       |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.textAreaControl("Alt Text (Alternative Text)", "picture of dog");
    ```

10. stylesControl

    -   Command for changing the block style control in native blocks

    Syntax:

    ```jsx
    .stylesControl( name, value )
    .stylesControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.stylesControl("Block Design", "Rounded");
    ```

11. fontSizeControl

    -   Command for changing the font size in native blocks

    Syntax:

    ```jsx
    .fontSizeControl( name, value )
    .fontSizeControl( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - string
    -   options - Object

    Options:

    | Option       | Data type | Default value | Description                        |
    | ------------ | --------- | ------------- | ---------------------------------- |
    | beforeAdjust | function  | () => {}      | Function to call before adjustment |

    Usage:

    ```jsx
    cy.fontSizeControl("Font size", "Large");
    ```

12. adjust

    -   Command for adjusting settings using controls within gutenberg editor

    Syntax:

    ```jsx
    .adjust( name, value )
    .adjust( name, value, options )
    ```

    Arguments:

    -   name - string
    -   value - string, number
    -   options - Object

    Options:

    | Option        | Data type | Default value               | Description                     |
    | ------------- | --------- | --------------------------- | ------------------------------- |
    | customOptions | object    | {}                          | Additional options for controls |
    | parentElement | string    | '.components-panel\_\_body' | Parent element of base control  |

    Usage:

    ```jsx
    cy.adjust("Border Radius", 27);
    ```

13. resetStyle

    -   Command for resetting the style using controls within gutenberg editor

    Syntax:

    ```jsx
    .resetStyle( name )
    .resetStyle( name, options )
    ```

    Arguments:

    -   name - string
    -   options - Object

    Options:

    | Option        | Data type | Default value               | Description                     |
    | ------------- | --------- | --------------------------- | ------------------------------- |
    | customOptions | object    | {}                          | Additional options for controls |
    | parentElement | string    | '.components-panel\_\_body' | Parent element of base control  |

    Usage:

    ```jsx
    cy.resetStyle("Height");
    ```

---

### editor.js

1. newPage

    - Command for opening a new page in gutenberg editor

    Syntax:

    ```jsx
    .newPage()
    ```

    Usage:

    ```jsx
    cy.newPage();
    ```

2. hideAnyGutenbergTip

    - Command for closing the gutenberg tip popup

    Syntax:

    ```jsx
    .hideAnyGutenbergTip()
    ```

    Usage:

    ```jsx
    cy.hideAnyGutenbergTip();
    ```

3. getPostUrls

    - Command that returns the original link address and preview address

    Syntax:

    ```jsx
    .getPostUrls()
    ```

    Usage:

    ```jsx
    cy.getPostUrls().then(({ editorUrl, previewUrl }) => {
    	// use editorUrl and previewUrl in code
    });
    ```

4. waitUntil

    - Command for waiting to resolve anything in cy.window or cy.document

    Syntax:

    ```jsx
    .waitUntiil()
    .waitUntil( callback )
    .waitUntil( callback, options )
    ```

    Arguments:

    - callback - function
    - options - Object

    Options:

    | Option       | Data type | Default value | Description                                      |
    | ------------ | --------- | ------------- | ------------------------------------------------ |
    | initialDelay | int       | 20            | Initial delay before checking for wait condition |
    | interval     | int       | 300           | Interval between wait and checking for condition |

    Usage:

    ```jsx
    cy.waitUntil((done) => {
    	cy.window().then((win) => {
    		done(win.FontAwesome);
    	});
    });
    ```

5. waitLoader

    - Command for waiting a spinner button to disappear

    Syntax:

    ```jsx
    .waitLoader( selector )
    .waitLoader( selector, options )
    ```

    Arguments:

    - selector - string
    - options - Object

    Options:

    | Option       | Data type | Default value | Description                                      |
    | ------------ | --------- | ------------- | ------------------------------------------------ |
    | initialDelay | int       | 20            | Initial delay before checking for wait condition |
    | interval     | int       | 100           | Interval between wait and checking for condition |

    Usage:

    ```jsx
    cy.waitLoader(".ugb-icon-popover__iconlist>span.components-spinner");
    ```

6. changePreviewMode

    - Command for changing the preview mode

    Syntax:

    ```jsx
    .changePreviewMode()
    .changePreviewMode( mode )
    ```

    Arguments:

    - mode - string

    Usage:

    ```jsx
    cy.changePreviewMode("Mobile");
    ```

7. getPreviewMode

    - Command that returns the current editor's preview mode

    Syntax:

    ```jsx
    .getPreviewMode()
    ```

    Usage:

    ```jsx
    cy.getPreviewMode().then((previewMode) => {
    	// use previewMode in code
    });
    ```

8. publish

    - Command for publishing a page

    Syntax:

    ```jsx
    .publish()
    ```

    Usage:

    ```jsx
    cy.publish();
    ```

9. wp

    - Command for getting the gutenberg `wp` object

    Syntax:

    ```jsx
    .wp()
    ```

    Usage:

    ```jsx
    cy.wp().then((wp) => {
    	// use wp in code
    });
    ```

---

### inspector.js

1. toggleSidebar

    - Command for toggling a sidebar

    Syntax:

    ```jsx
    .toggleSidebar( sidebarName )
    .toggleSidebar( sidebarName, value )
    ```

    Arguments:

    - sidebarName - string
    - value - boolean

    Usage:

    ```jsx
    cy.toggleSidebar("edit-post/block", true);
    ```

2. openSidebar

    - Command for opening a sidebar button.

    Syntax:

    ```jsx
    .openSidebar( sidebarName )
    ```

    Arguments:

    - sidebarName - string

    Usage:

    ```jsx
    cy.openSidebar("Stackable Settings");
    ```

3. closeSidebar

    - Command for closing a sidebar button

    Syntax:

    ```jsx
    .closeSidebar( sidebarName )
    ```

    Arguments:

    - sidebarName - string

    Usage:

    ```jsx
    cy.closeSidebar("Stackable Settings");
    ```

4. getBaseControl

    - Command for getting the base control element that matches the label or regex

    Syntax:

    ```jsx
    .getBaseControl( matches )
    .getBaseControl( matches, options )
    ```

    Arguments:

    - matches - string, RegExp
    - options - Object

    Options:

    | Option               | Data type | Default value               | Description                                 |
    | -------------------- | --------- | --------------------------- | ------------------------------------------- |
    | isInPopover          | boolean   | true                        | If the control is in popover                |
    | customParentSelector | string    | '.components-panel\_\_body' | Parent element of base control              |
    | supportedDelimiter   | array     | [ '>', '>div>' ]            | Delimiters that can be used in the selector |

    Usage:

    ```jsx
    cy.getBaseControl(name, { isInPopover });
    ```

5. collapse

    - Command for collapsing inspector accordion

    Syntax:

    ```jsx
    .collapse( name )
    .collapse( name, toggle )
    ```

    Arguments:

    - name - string
    - toggle - boolean

    Usage:

    ```jsx
    cy.collapse("Container");
    ```

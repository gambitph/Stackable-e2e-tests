## Commands
### commands/editor.js

1. waitFA
    - Stackable Command for waiting FontAwesome to register inside window.

    Usage:

    ```jsx
    cy.waitFA()
    ```

---

### commands/controls.js

1. adjustLayout
    - Stackable Command for changing the layout of the block.

    Syntax:

    ```jsx
    cy.adjustLayout( value )
    ```

    Arguments:

    - value - string

    Usage:

    ```jsx
    cy.adjustLayout( 'Basic' )
    ```

2. adjustDesign
    - Stackable Command for changing the design of the block.

    Syntax:

    ```jsx
    cy.adjustDesign( option )
    ```

    Arguments:

    - option - string

    Usage:

    ```jsx
    cy.adjustDesign( 'Dim Accordion' )
    ```

3. changeIcon
    - Stackable Command for changing the icon in icon block.

    Syntax:

    ```jsx
    cy.changeIcon( index, keyword )
    cy.changeIcon( index, keyword, icon )
    ```

    Arguments:

    - index - number
    - keyword - string
    - icon - string

    Usage:

    ```jsx
    cy.changeIcon( 1, 'info' )
    ```

4. designControl
    - Command for adjusting the design control. Mainly used for top and bottom separator modules. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.designControl( name, value, options )
    ```

    Arguments:

    - name - string
    - value - any type
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

5. popoverControl
    - Command for adjusting the popover control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.popoverControl( name, value, options )
    ```

    Arguments:

    - name - string
    - value - any type
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover

6. popoverControlReset
    - Command for resetting the popover control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.popoverControlReset( name )
    ```

    Arguments:

    - name - string
7. suggestionControl
    - Command for adjusting the auto suggestion control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.suggestionControl( name, value, options )
    ```

    Arguments:

    - name - string
    - value - any type
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

8. suggestionControlClear
    - Command for resetting the auto suggestion control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.suggestionControlClear( name, options )
    ```

    Arguments:

    - name - string
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

9. fourRangeControl
    - Command for adjusting the four range control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.fourRangeControl( name, value, options )
    ```

    Arguments:

    - name - string
    - value - any type
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

10. fourRangeControlReset
    - Command for resetting the four range control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.fourRangeControlReset( name, options )
    ```

    Arguments:

    - name - string
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

11. columnControl
    - Command for adjusting the column control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.columnControl( name, value, options )
    ```

    Arguments:

    - name - string
    - value - any type
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

12. iconControl
    - Command for adjusting the icon control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.iconControl( name, value, options )
    ```

    Arguments:

    - name - string
    - value - any type
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

13. iconControlReset
    - Command for resetting the icon control. This function is utilized by the `cy.adjust()` command.

    Usage:

    ```jsx
    cy.iconControlReset( name, options )
    ```

    Arguments:

    - name - string
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    isInPopover | boolean | false | If the control is in popover
    beforeAdjust | function | () ⇒ {} | Function to call before adjustment

---

### commands/global-settings.js

1. addGlobalColor
    - Command for adding a global color in Stackable Settings.

    Syntax:

    ```jsx
    cy.addGlobalColor()
    cy.addGlobalColor( options )
    ```

    Arguments:

    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    name | string | '' | Set the name of a global color
    color | string | '' | Set a color to be added in global colors

    Usage:

    ```jsx
    cy.addGlobalColor( { name: 'Custom Color 1', color: '#000000' } )
    ```

2. resetGlobalColor
    - Command for resetting the global color palette.

    Usage:

    ```jsx
    cy.resetGlobalColor()
    ```

3. deleteGlobalColor
    - Command for deleting a global color in Stackable Settings.

    Syntax:

    ```jsx
    cy.deleteGlobalColor( selector )
    ```

    Arguments:

    - selector - number

    Usage:

    ```jsx
    cy.deleteGlobalColor( 2 )
    cy.deleteGlobalColor( 'Custom Color 1' )
    ```

4. adjustGlobalTypography
    - Command for adjusting the global typography in Stackable Settings.

    Syntax:

    ```jsx
    cy.adjustGlobalTypography( selector, options )
    ```

    Arguments:

    - selector - string
    - options - Object

    Usage:

    ```jsx
    cy.adjustGlobalTypography( 'h1', { 'Font Family': 'Abel', 'Size': '39' } )
    ```

5. resetGlobalTypography
    - Command for resetting the global typography style.

    Syntax:

    ```jsx
    cy.resetGlobalTypography( selector )
    ```

    Arguments:

    - selector - string

    Usage:

    ```jsx
    cy.resetGlobalTypography( 'h1' )
    ```

---

### commands/inspector.js

1. openInspector
    - Stackable Command for opening the block inspector of a block.

    Syntax:

    ```jsx
    cy.openInspector( subject, tab )
    cy.openInspector( subject, tab, selector )
    ```

    Arguments:

    - subject - any type
    - tab - string
    - selector - string

    Usage:

    ```jsx
    cy.openInspector( 'ugb/accordion', 'Style', 'Accordion 1' )
    ```

2. toggleStyle
    - Stackable Command for enabling/disabling an accordion.

    Syntax:

    ```jsx
    cy.toggleStyle( name )
    cy.toggleStyle( name, enabled )
    ```

    Arguments:

    - name - string
    - enabled - boolean
        - default value: true

    Usage:

    ```jsx
    cy.toggleStyle( 'Title' )
    ```

3. getActiveTab
    - Stackable Command for getting the active tab in inspector. It returns the active tab in lowercase format.

    Syntax:

    ```jsx
    cy.getActiveTab()
    ```

    Usage:

    ```jsx
    cy.getActiveTab().then( tab => {
    	// do something
    } )
    ```

---
### commands/toolbar.js

1. copyStyle
    - Stackable Command for copying the styles of a block.

    Syntax:

    ```jsx
    cy.copyStyle( subject, blockToCopy )
    ```

    Arguments:

    - subject - string
    - blockToCopy - string | number | Object

    Usage:

    ```jsx
    cy.copyStyle( 'ugb/accordion', 'Accordion 1' )
    ```

2. pasteStyle
    - Stackable Command for pasting the styles of a block.

    Syntax:

    ```jsx
    cy.pasteStyle( subject, blockToPaste )
    ```

    Arguments:

    - subject - string
    - blockToPaste - string | number | Object

    Usage:

    ```jsx
    cy.pasteStyle( 'ugb/accordion', 'Accordion 2' )
    ```

3. adjustDynamicContent
    - Stackable Command for adjusting the dynamic content options in the toolbar.

    Syntax:

    ```jsx
    cy.adjustDynamicContent( blockName, blockSelector, selector, options )
    ```

    Arguments:

    - blockName - string
    - blockSelector - string | number | Object
    - selector - string
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    source | string | '' | Set the source of the dynamic content
    post | string | '' | Select the post of the dynamic content
    fieldName | string | '' | Select the field of the dynamic content
    fieldOptions | Object | {} | Adjust the options of a field

    Usage:
    ```jsx
    cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
        source: 'Current Post',
        fieldName: 'Post Title'
    } )
    ```

---
### commands/settings.js

1. forceTypographyStyles
    - Command for forcing typography styles in Stackable Settings page.

    Syntax:

    ```jsx
    cy.forceTypographyStyles()
    ```

    Usage:

    ```jsx
    cy.forceTypographyStyles()
    ```

2. loadFrontendJsCssFiles
    - Command for loading JS and CSS files across entire site in Stackable Settings page.

    Syntax:

    ```jsx
    cy.loadFrontendJsCssFiles()
    ```

    Usage:

    ```jsx
    cy.loadFrontendJsCssFiles()
    ```

3. disableOptimization
    - Command for disabling optimization setting in Stackable settings.

    Syntax:

    ```jsx
    cy.disableOptimization()
    ```

    Usage:

    ```jsx
    cy.disableOptimization()
    ```

---
### commands/setup.js

1. activateLicense
    - Command for activating the license key for Stackable.

    Syntax:

    ```jsx
    cy.activateLicense()
    ```

    Usage:

    ```jsx
    cy.activateLicense()
    ```
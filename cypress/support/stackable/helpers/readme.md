## Helper functions
### helpers/advanced.js

1. assertAdvancedTab
    - Assertion function for Advanced Tab

    Syntax:

    ```jsx
    assertAdvancedTab( selector, options )
    ```
    Usage:

    ```jsx
    assertAdvancedTab( '.ugb-accordion', { viewport } )
    ```
    Arguments:

    - selector - string
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    disableColumnHeight | boolean | false | disables column height
    disableColumnVerticalAlign | boolean | false | disables column vertical align
    disableBlockMargins | boolean | false | disables block margins
    disableBlockPaddings | boolean | false | disables block paddings
    enableMarginTop | boolean | true | enables margin top
    enableMarginRight | boolean | true | enables margin right
    enableMarginBottom | boolean | true | enables margin bottom
    enableMarginLeft | boolean | true | enables margin left
    enablePaddingTop | boolean | true | enables padding top
    enablePaddingRight | boolean | true | enables padding right
    enablePaddingBottom | boolean | true | enables padding bottom
    enablePaddingLeft | boolean | true | enables padding left
    paddingUnits | Array | "[ 'px', 'em', '%' ]" | sets the units for padding
    marginUnits | Array | "[ 'px', '%' ]" | sets the units for margin
    verticalAlignSelector | string | null | sets the selector to use for vertical align
    customCssSelectors | Array | [] | sets the selectors for custom css
    viewport | string | 'Desktop' | sets the desired viewport
    mainSelector | string | null | sets the main selector


---

### helpers/index.js

1. blockErrorTest
    - Helper function for creating block validation test.

    Syntax:

    ```jsx
    blockErrorTest( blockName )
    ```

    Arguments:

    - blockName - string

    Usage:

    ```jsx
    blockErrorTest( 'ugb/accordion' )
    ```

2. assertBlockExist
    - Helper function for creating block exist assertion.

    Syntax:

    ```jsx
    assertBlockExist( blockName, selector )
    ```

    Arguments:

    - blockName - string
    - selector - string

    Usage:

    ```jsx
    assertBlockExist( 'ugb/accordion', '.ugb-accordion' )
    ```

3. switchDesigns
    - Helper function for switching designs.

    Syntax:

    ```jsx
    switchDesigns( blockName, designs )
    ```

    Arguments:

    - blockName - string
    - designs - Array

    Usage:

    ```jsx
    switchDesigns( 'ugb/accordion', [ 'Dim Accordion', 'Elevate Accordion', 'Lounge Accordion' ] )
    ```

4. switchLayouts
    - Helper function for switching layouts.

    Syntax:

    ```jsx
    switchLayouts( blockName, layouts )
    ```

    Arguments:

    - blockName - string
    - layouts - Array

    Usage:

    ```jsx
    switchLayouts( 'ugb/accordion', [ 'Basic', 'Plain' ] )
    ```

5. assertAligns
    - Helper function for generating text align assertion commands.

    Syntax:

    ```jsx
    assertAligns( name, selector )
    assertAligns( name, selector, options )
    assertAligns( name, selector, options, assertOptions )
    ```

    Arguments:

    - name - string
    - selector - string
    - options - Object
    - assertOptions - Object

    Usage:

    ```jsx
    assertAligns( 'Align', '.ugb-inner-block', { viewport } )
    ```

6. registerTests
    - Helper function for registering tests.

    Syntax:

    ```jsx
    registerTests( testsList )
    registerTests( testsList, onTestsStart )
    ```

    Arguments:

    - testsList - Array
    - onTestsStart - Function

    Usage:

    ```jsx
    registerTests( [ blockExist, blockError ] )
    ```

7. responsiveAssertHelper
    - Helper function for creating responsive assertions.

    Syntax:

    ```jsx
    responsiveAssertHelper( callback )
    responsiveAssertHelper( callback, options )
    ```
    Usage:

    ```jsx
    responsiveAssertHelper( styleTab )
    responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )
    ```
    Arguments:

    - callback - Function
    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    tab | string | 'Style' | used for logging which tab is being asserted. For readability
    disableItAssertion | boolean | false | disables the assertion


8. assertTypography
    - Helper function for Typography popover assertion.

    Syntax:

    ```jsx
    assertTypography( selector, options )
    assertTypography( selector, options, assertOptions )
    ```
    Usage:

    ```jsx
    assertTypography( '.ugb-accordion__title', { viewport } )
    ```
    Arguments:

    - selector
    - options
    - assertOptions

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    viewport | string | 'Desktop' | sets the desired viewport
    enableFontFamily | boolean | true | enables font family assertion
    enableSize | boolean | true | enables size assertion
    enableWeight | boolean | true | enables weight assertion
    enableTransform | boolean | true | enables transform assertion
    enableLineHeight | boolean | true | enables line height assertion
    enableLetterSpacing | boolean | true | enables letter spacing assertion


9. assertContainer
    - Helper function for Container panel assertion.

    Syntax:

    ```jsx
    assertContainer( selector, options, attrNameTemplate )
    ```
    Usage:

    ```jsx
    assertContainer( '.ugb-accordion__heading', { viewport }, 'container%sBackgroundMediaUrl' )
    ```
    Arguments:

    - selector - string
    - options - Object
    - attrNameTemplate - string

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    viewport | string | | sets the desired viewport


---

### helpers/modules.js

1. assertBlockTitleDescription
    - Assertion function for Block Title and Block Description.

    Syntax:

    ```jsx
    assertBlockTitleDescription( options )
    assertBlockTitleDescription( options, assertOptions )
    ```
    Usage:

    ```jsx
    assertBlockTitleDescription( { viewport } )
    ```
    Arguments:

    - options - Object
    - assertOptions

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    viewport | string | 'Desktop' | sets the desired viewport
    enableSpacing | boolean | true | enables spacing


2. assertBlockTitleDescriptionContent
    - Assertion function for typing content into Block Title and Block Description.

    Syntax:

    ```jsx
    assertBlockTitleDescriptionContent( subject )
    assertBlockTitleDescriptionContent( subject, assertOptions )
    ```

    Arguments:

    - subject - string
    - assertOptions - Object

    Usage:

    ```jsx
    assertBlockTitleDescriptionContent( 'ugb/card' )
    ```

3. assertBlockBackground
    - Assertion function for Block Background.

    Syntax:

    ```jsx
    assertBlockBackground( selector, options )
    assertBlockBackground( selector, options, assertOptions )
    ```
    Usage:

    ```jsx
    assertBlockBackground( '.ugb-blockquote', { viewport } )
    ```
    Arguments:

    - selector - string
    - options - Object
    - assertOptions - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    viewport | string | 'Desktop' | sets the desired viewport


4. assertSeparators
    - Assertion function for Top and Bottom Separator.

    Syntax:

    ```jsx
    assertSeparators( options )
    assertSeparators( options, assertOptions )
    ```
    Usage:

    ```jsx
    assertSeparators( { viewport } )
    ```
    Arguments:

    - options - Object
    - assertOptions - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    viewport | string | 'Desktop' | sets the desired viewport

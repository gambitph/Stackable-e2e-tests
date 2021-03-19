### util.js Functions

1. modifyLogFunc
    - Function for overwriting log argument of commands.

    Syntax:

    ```jsx
    modifyLogFunc()
    modifyLogFunc( options )
    ```

    Arguments:

    - options - Object

    Option | Data type | Default value | Description
    ------ | --------- | ------------- | -----------
    position | string | 'last' | sets the position
    argumentLength | | false | sets the argument length

    Usage:

    ```jsx
    modifyLogFunc( { argumentLength: 2 } )
    ```

2. changeUnit
    - Function for changing the unit in control.

    Syntax:

    ```jsx
    changeUnit( unit, name, isInPopover )
    ```

    Arguments:

    - unit - string
    - name - string
    - isInPopover - boolean

    Usage:

    ```jsx
    changeUnit( unit, name, isInPopover )
    changeUnit( 'px', 'Size', false )
    ```

3. changeControlViewport
    - Function for changing the viewport in control

    Syntax:

    ```jsx
    changeControlViewport( viewport, name, isInPopover )
    ```

    Usage:

    ```jsx
    changeControlViewport( viewport, name, isInPopover )
    changeControlViewport( 'Desktop', 'Size', false )
    ```

    - isInPopover - boolean
    - name - string
    - viewport - string

    Arguments:

4. elementContainsText
    - Function for checking if text exists within a DOM element in a recursive manner. Returns true if it contains text to be matched and false if it doesn't.

    Syntax:

    ```jsx
    elementContainsText( $parentElement, textToMatch )
    ```

    Arguments:

    - $parentElement - jQuery
    - textToMatch - string

    Usage:

    ```jsx
    elementContainsText( Cypress.$( '.components-base-control' ), 'Size' )
    ```
### util.js Functions

1. withInspectorTabMemory

    - Function for overwriting assertions
    - Adds functionality of going back to selected block and current tab
    - Temporary overwrite fix @see stackable/util.js

    Syntax:

    ```jsx
    withInspectorTabMemory();
    withInspectorTabMemory(options);
    ```

    Arguments:

    - options - Object

    Options:

    | Option         | Data type | Default value | Description                                                 |
    | -------------- | --------- | ------------- | ----------------------------------------------------------- |
    | argumentLength | int       | 1             | Number of arguments of assertion function to be overwritten |

    Usage:

    ```jsx
    Cypress.Commands.overwrite(
    	"assertComputedStyle",
    	withInspectorTabMemory({ argumentLength: 3 })
    );
    ```

    Rules/Requirements:

    - `withInspectorTabMemory()` requires being used inside the `Cypress.Commands.overwrite()` call

2. createElementFromHTMLString

    - Create a DOM Element based on HTML string

    Syntax:

    ```jsx
    createElementFromHTMLString(htmlString);
    ```

    Arguments:

    - htmlString - string

    Usage:

    ```jsx
    createElementFromHTMLString(wp.blocks.getBlockContent(block));
    ```

3. getBlockStringPath

    - Function for returning a stringified path location of the block from `wp.data.select('core/block-editor').getBlocks()` by clientId
    - e.g. [0].innerBlocks[2]

    Syntax:

    ```jsx
    getBlockStringPath(blocks, clientId);
    ```

    Arguments:

    - blocks - array
    - clientId - string

    Usage:

    ```jsx
    getBlockStringPath(
    	wp.data.select("core/block-editor").getBlocks(),
    	subject.data("block")
    );
    ```

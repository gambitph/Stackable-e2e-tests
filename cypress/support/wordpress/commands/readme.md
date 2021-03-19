## Commands
### plugins.js

1. deactivatePlugin
    - Command for deactivating a plugin.

    Syntax:

    ```jsx
    cy.deactivatePlugin( slug )
    ```

    Usage:

    ```jsx
    cy.deactivatePlugin( 'stackable-ultimate-gutenberg-blocks' )
    ```

2. activatePlugin
    - Command for activating a plugin.

    Syntax:

    ```jsx
    cy.activatePlugin( slug )
    ```

    Usage:

    ```jsx
    cy.activatePlugin( 'stackable-ultimate-gutenberg-blocks' )
    ```

3. assertPluginError
    - Command for asserting an error due to plugin activation.

    Syntax:

    ```jsx
    cy.assertPluginError()
    ```

    Usage:

    ```jsx
    cy.assertPluginError()
    ```

---

### setup.js

1. loginAdmin
    - Command used to enter the login credentials of the admin.

    Syntax:

    ```jsx
    cy.loginAdmin()
    ```

    Usage:

    ```jsx
    cy.loginAdmin()
    ```

2. setupWP
    - Command for running the initial setup for the test.

    Syntax:

    ```jsx
    cy.setupWP()
    cy.setupWP( args )
    ```

    Usage:

    ```jsx
    cy.setupWP()
    ```

3. registerPosts
    - Command for creating blog posts

    Syntax:

    ```jsx
    cy.registerPosts( args )
    ```

    Usage:

    ```jsx
    cy.registerPosts( { numOfPosts: 1 } )
    ```
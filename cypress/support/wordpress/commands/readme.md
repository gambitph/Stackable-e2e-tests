## Commands
### commands/plugins.js

1. deactivatePlugin
    - Command for deactivating a plugin.

    Syntax:

    ```jsx
    cy.deactivatePlugin( slug )
    ```

    Arguments:

    - slug - string

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

    Arguments:

    - slug - string

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

### commands/setup.js

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

    Arguments:

    - args - Object

    Usage:

    ```jsx
    cy.setupWP()
    ```

3. registerPosts
    - Command for creating dummy posts

    Syntax:

    ```jsx
    cy.registerPosts( args )
    ```

    Arguments:

    - args - Object

    Usage:

    ```jsx
    cy.registerPosts( { numOfPosts: 1 } )
    ```

4. changeRole
    - Command for changing the role of the current user.

    Syntax:

    ```jsx
    cy.changeRole( args )
    ```

    Arguments:

    - args - Object

    Usage:

    ```jsx
    cy.changeRole( { roleTo: 'editor' } )
    ```

5. editSiteTitle
    - Command for editing the site title in the customizer.

    Syntax:

    ```jsx
    cy.editSiteTitle( title )
    ```

    Arguments:

    - title - string

    Usage:

    ```jsx
    cy.editSiteTitle( 'My Blog' )
    ```

6. editSiteTagline
    - Command for editing the site tagline in the customizer.

    Syntax:

    ```jsx
    cy.editSiteTagline( tagline )
    ```

    Arguments:

    - tagline - string

    Usage:

    ```jsx
    cy.editSiteTagline( 'Just another WordPress site.' )
    ```
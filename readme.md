# End-to-end Integration and Acceptance Testing for Stackable

## Getting Started
### Things to Install

1. NodeJS - https://nodejs.org/en/
2. npm - https://www.npmjs.com/get-npm
3. Local by Flywheel - https://localwp.com/
4. git version control - https://git-scm.com/downloads

### Setup

1. Open your command prompt/terminal.
2. Clone the repository by typing `git clone https://github.com/gambitph/Stackable-e2e-tests.git`
3. Type `cd /path/to/root/folder/Stackable-e2e-tests`
4. Install node package dependencies by typing `npm install`
5. Create a Local by Flywheel test site on http://e2etest.local/ this should only be used for testing. Username and password for this test site should be set as "admin".
6. Place this as a plugin in http://e2etest.local/ by creating a symlink.
    * For Linux: `ln -s "/path/to/Stackable-e2e-tests" "/path/to/test/site/.../app/public/wp-content/plugins"`
    * For Windows: `mklink "/path/to/test/site/.../app/public/wp-content/plugins" "/path/to/Stackable-e2e-tests"`
7. Activate the plugin.


### How to Run

1. Make sure this plugin is activated in your test site.
2. Run `npm run test`
3. In the window that opens, pick a test to run or click run all tests.

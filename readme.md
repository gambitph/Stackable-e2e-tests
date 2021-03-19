# End-to-end Integration and Acceptance Testing for Stackable

## Getting Started
### Things to Install

1. NodeJS - https://nodejs.org/en/
2. npm - https://www.npmjs.com/get-npm
3. Local by Flywheel - https://localwp.com/
4. git version control - https://git-scm.com/downloads

### Setup

1. Create a Local by Flywheel test site on http://e2etest.local/ this should only be used for testing. Username and password for this test site should be set as "admin".
2. Go to your test site's plugins folder. Type `cd /path/to/test/site/.../app/public/wp-content/plugins`
3. Clone the repository to the plugins folder by typing `git clone https://github.com/gambitph/Stackable-e2e-tests.git`
4. Type `cd /path/to/Stackable-e2e-tests`
5. Install node package dependencies by typing `npm install`
6. Open your browser and go to http://e2etest.local/. Activate the plugin.

### How to Run

1. Make sure this plugin is activated in your test site.
2. Run `npm run test`
3. In the window that opens, pick a test to run or click run all tests.

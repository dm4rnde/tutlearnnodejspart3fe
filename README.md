
# Tutorial. Learn Node.js. Part 3: Front End.

Source code for tutorial https://dm4rnde.com/frend-ex1.


Instructions of use:

*PRECONDITION: MongoDB has been installed and new db (that 
web app is going to use) has been prepared -- try going through monodb_setup_users.txt to
set up users (install and prepare of db with longer description is at https://dm4rnde.com/mongodb-setup).*

- Clone current project

- 	`cd tutlearnnodejspart3fe/planetsmoonsapp/`	
	
	`npm install mongoose express body-parser --save`
	
	`npm install mocha chai chai-http --save-dev`
	
	`npm install`
	
	`export NODE_ENV=development`

- Verify. Tests should all pass:

	`npm test`

- Starting web app:

	`npm start`
	
	- In browser open: `localhost: 8081`. Verify that web app's front end functions.
	   

# Tutorial. Learn Node.js. Part 3: Front End.

Source code for tutorial https://dm4rnde.com/frend-ex1.


Having architected the back end components (mongodb; RESTful API), this tutorial added final component - the front end - to example web app.


## Instructions of use:

- Go through monodb_setup_users.txt 

	This will set up users for db (that current web app is going to use) under MongoDB *(some help on MongoDB install and users setup: https://dm4rnde.com/mongodb-setup)*.

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
	   
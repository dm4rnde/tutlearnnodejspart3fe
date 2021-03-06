```
	NOTE! This code is not actively managed and dependencies might be out-of-date 
	(because of not being up-to-date it might contain vulnerabilities)!
```

# Tutorial. Learn Node.js. Part 3: Front End.

Source code for tutorial https://dm4rnde.com/frend-ex1.


Having architected the back end components (mongodb; RESTful API), this tutorial added final component - the front end - to complete example web app.


## Instructions of use:

- Go through monodb_setup.txt

	This will set up users for db *(some help on MongoDB install and users setup: https://dm4rnde.com/mongodb-setup)* and start mongod.

- Clone current project (i.e., `git clone https://github.com/dm4rnde/tutlearnnodejspart3fe.git`)

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
	   


# Tutorial. Learn Node.js. Part 3: Front End.

Source code for tutorial https://dm4rnde.com/frend-ex1.


Instructions of use:

- Clone current project

- 	`cd tutlearnnodejspart3fe/planetsmoonsapp/`	
	
	`npm install mongoose express body-parser --save`
	
	`npm install mocha chai chai-http --save-dev`
	
	`npm install`
	
	`export NODE_ENV=development`

	`sed -i "" "s/normalizePort(process.env.PORT || '3000'/normalizePort(process.env.PORT || '8081'/g" bin/www`

- Verify. Tests should all pass:

	`npm test`

- Starting web app:

	`npm start`
	
	- In browser open: `localhost: 8081`. Verify that web app's front end functions.
	
	
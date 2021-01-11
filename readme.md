# Fastify Boilerplate
[![Build Status](https://travis-ci.com/aalfiann/fastify-boilerplate.svg?branch=master)](https://travis-ci.com/aalfiann/fastify-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/aalfiann/fastify-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/aalfiann/fastify-boilerplate?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/aalfiann/fastify-boilerplate/badge.svg?targetFile=package.json)](https://snyk.io//test/github/aalfiann/fastify-boilerplate?targetFile=package.json)
![License](https://img.shields.io/github/license/aalfiann/fastify-boilerplate)    
Fastify Boilerplate with JWT, Mongoose and Bulma

### Get Started
Please see the documentations at [here](https://github.com/aalfiann/fastify-boilerplate/wiki).

### Features
- Login
- Logout
- Forgot Password
- Menu Management
- User Management
- Reset & Change Password
- Manage Profile
- Public Profile
- Dashboard
- Contact Form
- Backup & Restore Database
- Rest API


### Concepts
Our goal is to create a web application that scales well (horizontal scale), strong in high traffic.

- **Stateless**  
  Authentication is stateless with JWT Token, this is the important thing to achieve horizontal scale.
- **No Cookie**  
  Session is saved to localStorage at client browser.
- **Built-in API**  
  Server just render the page and using ajax to get data from API.
- **MongoDB**  
  MongoDB is horizontal, scale-out architecture can support huge volumes of both data and traffic.
- **Built-in Cache**  
  With built-in cache mechanism (support in memory, redis or filebased cache) could make request faster and save the request traffic/bandwidth to MongoDB.

### Security
- **JWT Authentication**  
  JWT Token is using RS256 with private and public key signature (required to use SSL).

- **Routes with schema validation**  
  Any payload send to the server is validated.

- **Safe from MongoDB Injection**  
  Any input data already validated by mongoose schemas.

- **Safe from XSS**  
  Template engine and Reactive UI (Reef) has already encoded the markup.

- **Safe from CSRF**  
  Any request in admin/user area is required token by JWT.

- **Safe from Bad Bots**  
  Any bots is handled automatically by reCaptcha Google.

- **Error handler for 4xx and 5xx**  
  Any internal error is handled automatically by Fastify.

### Specs
- Fastify v3
- Mongoose v5
- ETA Template Engine
- Bulma CSS Framework
- Material Design Icons v5
- Asynchronous designed
- HTML auto minified
- Reactive UI with Reef

### Requirement
- NodeJS v10++
- MongoDB v4
- Redis v4 [Optional]

### Usage
1. Download this source code.
2. Extract and go to current directory then run `npm install`
3. Edit the `config.js`
4. Run (only once) `npm run first_install`
5. Run `node server.js`
6. Done.

### Utility
- **Backup Database**
```
npm run backup
```
- **Restore Database**
```
node db-restore.js -p backup/FOLDER_NAME
```
- **Unit Test**
```
npm test
```

### Rest API
If you want to play with Rest API
- Just import `postman_collection.json` to Postman App.

### Note
- If you want to regenerate private and public key, go to here >> [http://travistidwell.com/jsencrypt/demo](http://travistidwell.com/jsencrypt/demo/).
- If you want to validate the JWT Token, go to here >> [https://jwt.io](https://jwt.io/)

### Credits
This Fastify Boilerplate is already include 3rd party license properly.

**Main Library**  
This main library is used to all template pages.
- [Ajax (1 kB)](https://github.com/fdaciuk/ajax)
- [Reef.js (2.6 kB)](https://github.com/cferdinandi/reef)
- [Dom.js (5.6 kB)](https://github.com/aalfiann/dom.js)
- [Template Admin One Bulma (32.3 kB)](https://github.com/vikdiesel/admin-one-bulma-dashboard)

**Optional Library**  
This optional libraries is only used to some pages who need it.
- [Native Form Validation (1.4 kB)](https://github.com/aalfiann/native-form-validation)
- [Chunk Handler (1.9 kB)](https://github.com/aalfiann/chunk-handler)
- [Fly Json ODM (4.7 kB)](https://github.com/aalfiann/fly-json-odm)
- [Sweetalert (29 kB)](https://github.com/t4t5/sweetalert)
- [Moment.js (40 kB)](https://github.com/moment/moment)
- [Chart.js (52.9 kB)](https://github.com/chartjs/Chart.js)
- [MDI Icons (53.2 kB)](https://github.com/Templarian/MaterialDesign)

Note: 
- All libraries above is used for frontend, for server side libraries, see `package.json`.
- The size libraries above is already minified and gzipped.

### Browser Support
- All latest browser supported (Chrome, EDGE, Firefox, Opera, Safari, etc).
- IE 11 is not supported.

> *Still Under Constructions*

---

# Fastify Boilerplate
Fastify Boilerplate with JWT, Mongoose and Bulma

### Features
- Login             >> done
- Logout            >> done
- Forgot Password   >> done
- Menu Management   >> done
- Change Password   >> done
- Manage Profile    >> done
- User Management   
- Admin Dashboard


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

### Usage
1. Download this source code.
2. Extact and go to current directory then run `npm install`
3. Edit the `config.js`
4. Run `node server.js`
5. Done.

### Unit test
If you want to play unit test
```
npm test
```

### Note
- If you want to regenerate private and public key, go to here >> [http://travistidwell.com/jsencrypt/demo](http://travistidwell.com/jsencrypt/demo/).
- If you want to validate the JWT Token, go to here >> [https://jwt.io](https://jwt.io/)

### Credits
This Fastify Boilerplate is already include 3rd party license properly.
- [Template Admin One Bulma (32.3 kB)](https://github.com/vikdiesel/admin-one-bulma-dashboard/)
- [Reef.js (2.6 kB)](https://github.com/cferdinandi/reef)
- [Dom.js (5.6 kB)](https://github.com/aalfiann/dom.js)
- [Ajax (1 kB)](https://github.com/fdaciuk/ajax)
- [Sweetalert (29 kB)](https://github.com/t4t5/sweetalert)
- [Native Form Validation (1.4 kB)](https://github.com/aalfiann/native-form-validation)
- [Fly Json ODM (4.7 kB)](https://github.com/aalfiann/fly-json-odm)
- [Chunk Handler (1.9 kB)](https://github.com/aalfiann/chunk-handler)
- [Chart.js (52.9 kB)](https://github.com/chartjs/Chart.js)

Note: 
- The size libraries above is already minified and gzipped.

### Browser Support
- All latest browser supported.
- IE 11 not supported.

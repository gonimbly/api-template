#The problem
Storing cookies in sessions is an old browser specific security paradigm for html/form based authentication. If you're building a scalable API that will serve multiple types of clients (iOS, android, web, native app, etc.), you need a performant security paradigm that scales. JWT, Redis, and Heroku are the modern tools for your product API.

##JWT
JSON Web Token is comprised of 3 components. Your header (encryption & type), payload (user meta, access rights), and signature (w/ secret). Use your Heroku hosted API to generate tokens and store in Redis for performance. 

####Usage
Every time a user makes a request to your API, included is a JWT. The JWT is checked against Redis and the request is processed if valid. It's pretty simple.

####Setup
######√First step is comparing username / password with a bcrypt'd verions of the same hash.

######√Next step is storing your email / password in Postres with bcrypt.

######√Next step is to setup your node/express server to return a JWT when a user is authenticated.
Going with `jwt-simple` for now just to get the hang of the flow and to easily write tokens to a store soon. I'm really appreciating the use of `bin` scripts while writing the API. It helps testing and they'll probably be very useful at some point. At least for provisioning access.

######Next step is having access check method as middleware for a get projects route.

######Next step is to store that token in Redis.
Why waste time and write tokens to DB. Let's skip straight to free Heroku Redis addon. `heroku addons:create heroku-redis:hobby-dev`

######Next step is to setup middleware to validate against Redis before processing API requests.

######Using SSL (https)
Can create a self-signed certificate for non-production application such as engaged. If it is production, purchase an SSL cert from an approved vendor.

##Useful Links
http://jwt.io/
https://github.com/dwyl/learn-json-web-tokens

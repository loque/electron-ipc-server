Request
===

The request object is created by the client and sent to every middleware callback on the server side.

## Properties

### req.body
Contains an object with data submitted by the client in the request body.

### req.client
Contains an object with information of the client emitting the request.

### req.id
A universally unique identifier (UUID) assigned automatically on creation.

### req.method
Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so on.

<!-- ### req.originalUrl -->
### req.params

This property is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.

> For more information, check req.params in the [Express documentation](http://expressjs.com/en/4x/api.html#req.params).

### req.path
Contains the path part of the request URL. This property is populated by the middleware `path`.

### req.query
This property is an object containing a property for each query string parameter in the route. If there is no query string, it is the empty object, {}.

> For more information, check req.query in the [Express documentation](http://expressjs.com/en/4x/api.html#req.query).

### req.url
This contains only the URL that is present in the actual HTTP request.

## Methods

### req.setURL(url)
This method is used to set the url. In future versions it will be more useful.

# sketch-fetch

Util library for sketch plugins handling async HTTP requests

**NOTE: This library is still very experimental, and ideally the API will completely change, so I don't recommend using it in production just yet unless you know what you are doing 😉**

## The problem

In Sketch plugins we are not within a browser environment, so the usual AJAX libraries like [fetch](https://github.com/github/fetch) don't work. However, I really like the syntax and easy usage of such libraries, and I'd like to be able to make HTTP Requests in Sketch plugins (or any other cocoascript project really) just as easy as in the browser.

The problem is, that asynchronous requests run on different threads, and therefore we loose the current application context when we get the HTTP Response.

I am working on ideas around that, not really successful as of now, so there is a current and an ideal solution to this problem.

## Current usage

Under the hood this libtary is just an abstraction of `NSMutableURLRequest` that gets executed using `NSURLSession`'s method:

```js
[session dataTaskWithRequest:NSMutableURLRequest completionHandler:Block]
```

The first currrent problem is that cocoascript doesn't allow you to define blocks (ObjC's equivalent to closures), so there is currently the need for an ObjC framework to be loaded to be able to use this library.

Also, due to the context issues described above, the workflow of asynchronous HTTP requests is not as intuitive as I hope it will be in the end just yet.

### 1. Load the framework

You have to load the framework before any of your requests, so to make sure this happens just include this snippet in your plugin in the beginning of every call of your `plugin.js` file:

```js
import { initWithContext as initFetch } from 'sketch-fetch';

function initWithContext (context) {
  initFetch(context);
  // Do your stuff...
}

function myAwesomePluginEndpoint (context) {
  initWithContext(context);
  // Do whatever your plugin should do...
}
```

It is good practise in general to have such an `initWithContext` method to be able to prepare your context for every initiation of a Sketch instance / new thread.

### 2. Do your requests

This is as simple as this:

```js
import fetch from 'sketch-fetch';

const options = { /* See available options */ };
fetch('https://awesome.url', options);
```

### 3. Handle the response

You currently need to define a plugin entrypoint to be able to handle the responses. You can do that as follows:

```js
import { handleResponses } from 'sketch-fetch';

function handleHttpResponse (context) {
  initWithContext(context);
  handleResponses((callback, response) => {
    switch (callback) {
      case 'myCallback':
        // Do something...
      break;
      default:
        log('ERROR: Callback unknown');
      break;
    }
  });
}
```

This method as of now has to be mapped to the handler `handleBridgeMessage` in your `manifest.json`.

### Bringing it all together

```js
import fetch, { initWithContext as initFetch, handleResponses } from 'sketch-fetch';

function initWithContext (context) {
  initFetch(context);
  // Do your stuff...
}

function myAwesomePluginEndpoint (context) {
  initWithContext(context);
    
  // Fetch data from url
  const options = {
    callback: 'myCallback',
    // See available options...
  };
  fetch('https://awesome.url', options);
}

function handleHttpResponse (context) {
  initWithContext(context);
  handleResponses((callback, response) => {
    switch (callback) {
      case 'myCallback':
        // Do something...
      break;
      default:
        log('ERROR: Callback unknown');
      break;
    }
  });
}
```

### Available options

```js
{
  callback: 'something', // string, identifier for the response handling
  headers: {}, // object, key value pairs for the request header
  args: {}, // object, key value pairs for normal string parameters
  files: { // object, file paths to be sent (for any request type but GET)
    varName: 'filepath'
  },
  method: 'GET', //string, GET|POST|PUT|DELETE|..., default is GET
}
```

## The ideal world

This is all still not ideal. In a perfect world, we could handle requests just like we can with fetch in a browser environment, like so:

```js
import fetch from 'sketch-fetch';

fetch(url, options)
  .then(json => {
    // Do something
  })
  .catch(() => {
    // Handle any errors
  })
  .send(); // we would need that, cause we need to define the callbacks before we actually send the request...
```

The only problem with this is that we loose the current context. We could save (a serialized version of) the callbacks on the main thread and retrieve these on response, but we would need to make sure that all contexts will be saved and retrieved as well, such as already imported helper functions or other external libraries...

I am currently working on some ideas for that and will update this repo when I find something worth sharing 😊
/*
 * express is a popular Node.js framework that makes it easy to create
 * a web server and define routes (URL paths the server responds to).
 * require() is Node's way of importing an external package — similar
 * to "import" in other languages.
 */
const express = require('express');

/*
 * path is a built-in Node.js module (no installation needed) that
 * provides utilities for working with file and directory paths.
 * We use it to build the correct path to the 'files' folder below.
 */
const path = require('path');

/*
 * body-parser is middleware that reads the raw request body and
 * converts it into a JavaScript object on req.body.
 * We use bodyParser.json() so that incoming JSON data (e.g. from
 * a PUT request) is automatically parsed before our route handler runs.
 */
const bodyParser = require('body-parser');

/*
 * Import the movie data from the movie-model module.
 * The movies are stored as an object keyed by imdbID, which allows
 * direct lookup (movieModel["tt0084787"]) in O(1) time.
 */
const movieModel = require('./movie-model.js');

/*
 * express() creates the actual server application object.
 * All configuration (routes, middleware) is added to this 'app' variable.
 */
const app = express();

/* Register the JSON body parser as middleware so every incoming
   request with Content-Type: application/json is automatically parsed */
app.use(bodyParser.json());

/*
 * express.static() is middleware that tells the server to automatically
 * serve any file sitting in the given folder when a client requests it.
 *
 * path.join(__dirname, 'files') builds the absolute path to the 'files'
 * sub-folder. In practice this means: if a browser requests '/', the
 * server sends back 'server/files/index.html' automatically.
 */
app.use(express.static(path.join(__dirname, 'files')));

/*
 * GET /movies — return all movies as a JSON array.
 *
 * The model stores movies as an object (keyed by imdbID), but the
 * client expects an array. Object.values() extracts just the values
 * (movie objects) from the model and returns them as an array.
 * res.json() serializes the array to JSON and sets the Content-Type
 * header to 'application/json' automatically.
 */
app.get('/movies', function (req, res) {
  res.json(Object.values(movieModel));
});

/*
 * GET /movies/:imdbID — return a single movie by its imdbID.
 *
 * :imdbID is a route parameter — Express extracts the value from the
 * URL and makes it available as req.params.imdbID.
 * For example, a request to /movies/tt0084787 sets req.params.imdbID
 * to "tt0084787".
 *
 * If the movie exists in the model, we send it as JSON.
 * If not, we respond with HTTP 404 (Not Found).
 */
app.get('/movies/:imdbID', function (req, res) {
  const movie = movieModel[req.params.imdbID];
  if (movie) {
    res.json(movie);
  } else {
    res.sendStatus(404);
  }
});

/*
 * PUT /movies/:imdbID — update an existing movie or create a new one.
 *
 * PUT is the HTTP method used to replace a resource at a given URL.
 * req.body contains the movie data sent by the client (parsed by
 * bodyParser.json() middleware).
 *
 * Two cases:
 *   - If the imdbID already exists → update the movie, respond 200 (OK)
 *   - If the imdbID is new → add the movie, respond 201 (Created)
 *     and send back the stored movie object
 */
app.put('/movies/:imdbID', function (req, res) {
  const imdbID = req.params.imdbID;
  const movie = req.body;

  if (movieModel[imdbID]) {
    /* Movie exists — replace it with the updated data */
    movieModel[imdbID] = movie;
    res.sendStatus(200);
  } else {
    /* Movie does not exist — add it as a new entry */
    movieModel[imdbID] = movie;
    res.status(201).json(movie);
  }
});

/*
 * app.listen() starts the HTTP server on port 3000.
 * Once running, visit http://localhost:3000/ in the browser.
 */
app.listen(3000);
console.log("Server now listening on http://localhost:3000/");

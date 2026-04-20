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
 * GET /movies — return movies as a JSON array.
 *
 * The model stores movies as an object (keyed by imdbID), but the
 * client expects an array. Object.values() extracts just the values
 * (movie objects) from the model and returns them as an array.
 *
 * Optional query parameter: ?genre=<name>
 *   - Query parameters arrive on req.query (parsed by Express). For the
 *     URL "/movies?genre=Action", req.query.genre is the string "Action".
 *   - When a genre is provided, we keep only movies whose Genres array
 *     contains that genre (Array.prototype.includes does an exact match).
 *   - When no genre is provided, req.query.genre is undefined (falsy),
 *     so we return the full list — this is required by Task 2.2.
 *
 * res.json() serializes the array to JSON and automatically sets the
 * Content-Type header to 'application/json'.
 */
app.get('/movies', function (req, res) {
  const genre = req.query.genre;
  const all = Object.values(movieModel);
  res.json(genre ? all.filter(m => m.Genres.includes(genre)) : all);
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
 * GET /genres — return the alphabetically sorted list of distinct genres
 *               across all movies in the model.
 *
 * Each movie has a Genres array (e.g. ["Horror", "Mystery", "Sci-Fi"]).
 * Different movies may share genres, so we use a Set to collect them
 * because a Set automatically removes duplicates.
 *
 * Steps:
 *   1. Object.values(movieModel) — array of all movie objects.
 *   2. Outer forEach iterates movies; inner forEach iterates that
 *      movie's Genres and adds each genre to the Set (duplicates ignored).
 *   3. [...genres] uses the spread operator to convert the Set into an
 *      array (Set is not directly serialisable to JSON).
 *   4. .sort() puts the genres in alphabetical order, which is the
 *      natural order for navigation buttons in the UI.
 *
 * Example (from the task description): for movies with genres
 *   ["Action","Adventure","Drama"], ["Comedy","Drama","Fantasy"],
 *   ["Drama","Romance"]
 * the response is
 *   ["Action","Adventure","Comedy","Drama","Fantasy","Romance"].
 */
app.get('/genres', function (req, res) {
  const genres = new Set();
  Object.values(movieModel).forEach(movie => {
    movie.Genres.forEach(genre => genres.add(genre));
  });
  res.json([...genres].sort());
});

/*
 * app.listen() starts the HTTP server on port 3000.
 * Once running, visit http://localhost:3000/ in the browser.
 */
app.listen(3000);
console.log("Server now listening on http://localhost:3000/");

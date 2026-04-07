/*
 * edit.js — Form handling for the movie edit page
 *
 * This file provides three main functions:
 *   - setMovie(movie): populates form fields from a movie object
 *   - getMovie(): reads form fields into a movie object
 *   - putMovie(): sends the movie data to the server via PUT
 *
 * At the bottom, initialization code reads the imdbID from the URL
 * query parameter and fetches the movie data from the server.
 */

/*
 * Populates the form fields with the movie data.
 *
 * Iterates over all elements in the first <form> on the page.
 * For each element, it looks up the matching property in the movie
 * object using the element's id as the key.
 *
 * Special handling for the Genres <select multiple>: instead of
 * setting a single value, it loops through all <option> elements
 * and marks each one as selected if it appears in the movie's
 * Genres array.
 */
function setMovie(movie) {
  for (const element of document.forms[0].elements) {
    const name = element.id;
    const value = movie[name];

    if (name === "Genres") {
      /* For the Genres select: mark each matching option as selected */
      const options = element.options;
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        option.selected = value.indexOf(option.value) >= 0;
      }
    } else {
      /* For all other fields: set the value directly */
      element.value = value;
    }
  }
}

/*
 * Reads the form fields and builds a movie object.
 *
 * Filters form elements to only those with an id (skipping buttons
 * that have no id). Then converts each field's value to the correct
 * JavaScript type:
 *   - Genres: array of selected option values
 *   - Metascore, Runtime, imdbRating: numbers (not strings)
 *   - Actors, Directors, Writers: arrays (split by comma)
 *   - Everything else: plain strings
 */
function getMovie() {
  const movie = {};

  /* Filter to only elements that have an id (skip buttons without ids) */
  const elements = Array.from(document.forms[0].elements).filter(
      (element) => element.id,
  );

  for (const element of elements) {
    const name = element.id;

    let value;

    if (name === "Genres") {
      /* Collect all selected genre options into an array */
      value = [];
      const options = element.options;
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.selected) {
          value.push(option.value);
        }
      }
    } else if (
        name === "Metascore" ||
        name === "Runtime" ||
        name === "imdbRating"
    ) {
      /* Convert numeric fields from string to number */
      value = Number(element.value);
    } else if (
        name === "Actors" ||
        name === "Directors" ||
        name === "Writers"
    ) {
      /* Split comma-separated list fields into arrays, trimming whitespace */
      value = element.value.split(",").map((item) => item.trim());
    } else {
      /* All other fields are plain strings (Title, Released, Plot, etc.) */
      value = element.value;
    }

    movie[name] = value;
  }

  return movie;
}

/*
 * Sends the edited movie data to the server via PUT request.
 *
 * 1. Reads the current form values into a movie object using getMovie()
 * 2. Opens a PUT request to /movies/:imdbID
 * 3. Sets the Content-Type header to application/json so the server's
 *    bodyParser.json() middleware can parse the request body
 * 4. Sends the movie data as a JSON string
 *
 * On success (200 = updated, 201 = created, 204 = no content):
 *   navigates back to the overview page.
 * On failure: shows an alert with the status code.
 */
function putMovie() {
  /* Read the current form values into a movie object */
  const movie = getMovie();

  const xhr = new XMLHttpRequest();

  /* Handle the server response after the PUT request completes */
  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
      /* Save successful — navigate back to the overview page */
      location.href = "index.html";
    } else {
      /* Save failed — show an error alert */
      alert("Saving of movie data failed. Status code was " + xhr.status);
    }
  };

  /* Configure PUT request to /movies/:imdbID endpoint */
  xhr.open("PUT", "/movies/" + movie.imdbID);
  /* Set Content-Type so the server knows to parse the body as JSON */
  xhr.setRequestHeader("Content-Type", "application/json");
  /* Send the movie data as a JSON string */
  xhr.send(JSON.stringify(movie));
}

/*
 * Initialization — runs when this script is loaded.
 *
 * Reads the imdbID from the URL query parameter (e.g. ?imdbID=tt0084787),
 * then fetches the movie data from the server via GET /movies/:imdbID.
 * When the response arrives, setMovie() populates the form fields.
 *
 * This works even though the script is in <head>: the XHR callback
 * fires asynchronously after the page has fully loaded, so the form
 * elements are available when setMovie() runs.
 */
const imdbID = new URLSearchParams(window.location.search).get("imdbID");

const xhr = new XMLHttpRequest();
xhr.open("GET", "/movies/" + imdbID);
xhr.onload = function () {
  if (xhr.status === 200) {
    /* Parse the JSON response and populate the form fields */
    setMovie(JSON.parse(xhr.responseText));
  } else {
    /* Show an error alert if loading failed */
    alert(
        "Loading of movie data failed. Status was " +
        xhr.status +
        " - " +
        xhr.statusText,
    );
  }
};

/* Send the GET request to fetch the movie */
xhr.send();

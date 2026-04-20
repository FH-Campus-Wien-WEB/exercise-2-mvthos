/*
 * index.js — Fetch and render movies on the overview page.
 *
 * Two responsibilities:
 *
 *   1. loadMovies(genre)
 *      Fetches /movies (optionally filtered by ?genre=<name>) and renders
 *      one <article> card per movie into the <main id="movies-container">
 *      element. Called by every nav button click and once on page load.
 *
 *   2. window.onload
 *      Fetches /genres, then for each genre creates a <button> in
 *      <nav id="genre-nav">. The first button is "All" (loads every
 *      movie). After the buttons exist, we programmatically click the
 *      first one to trigger the initial render.
 *
 * Both requests use XMLHttpRequest (XHR), the classic browser API for
 * making asynchronous HTTP requests without navigating away from the page.
 */

/*
 * loadMovies(genre)
 *
 * @param {string} [genre] — optional genre name to filter by. If omitted
 *                           or falsy, the server returns all movies.
 *
 * The function clears any previously rendered cards from the container,
 * builds the request URL (adding ?genre=<name> when filtering), then
 * fetches the data and rebuilds the card list from scratch.
 */
function loadMovies(genre) {
  /*
   * The container is the <main> element from index.html. We clear it
   * with innerHTML = "" so old cards from the previous filter are gone
   * before we render the new set.
   */
  const container = document.querySelector("#movies-container");
  container.innerHTML = "";

  /*
   * Build the request URL using the URL API. We start from "/movies"
   * relative to the current page origin. URLSearchParams.set() adds or
   * replaces the "genre" query parameter in a safe, escaped way (no
   * manual string concatenation that could break on weird genre names).
   *
   * If no genre is given we leave the URL as "/movies" and the server
   * returns the full list (see the GET /movies handler in server.js).
   *
   * Note: 'genre' must be the exact name of the query parameter — the
   * server reads req.query.genre.
   */
  const url = new URL("/movies", location.origin);
  if (genre) {
    url.searchParams.set("genre", genre);
  }

  const xhr = new XMLHttpRequest();

  /*
   * xhr.onload fires once the response has fully arrived. We check the
   * HTTP status: 200 = OK, anything else means we render an error message.
   */
  xhr.onload = function () {
    if (xhr.status === 200) {
      /*
       * The response is JSON text — JSON.parse() turns it into an array
       * of plain JavaScript movie objects we can iterate.
       */
      const movies = JSON.parse(xhr.responseText);

      /*
       * For every movie, build a self-contained <article> card and
       * append it to the container. We use createElement + appendChild
       * (not innerHTML strings) so user-provided text is never
       * interpreted as HTML — safer against XSS and easier to reason
       * about.
       */
      for (const movie of movies) {
        /*
         * <article> is the semantically correct element for a
         * self-contained piece of content like a single movie card.
         * We set its id to imdbID so each movie is uniquely identifiable
         * in the DOM (handy for debugging and future features).
         */
        const article = document.createElement("article");
        article.id = movie.imdbID;

        /* --- Poster image --- */
        const img = document.createElement("img");
        img.src = movie.Poster;
        img.alt = movie.Title + " poster";
        /*
         * onerror fires when the browser cannot load the image (broken
         * URL, network failure). We hide it so the card doesn't show a
         * broken-image icon next to the rest of the data.
         */
        img.onerror = function () {
          img.style.display = "none";
        };
        article.appendChild(img);

        /*
         * A <div> groups all the text fields into one column so flexbox
         * (in CSS) can place them next to the poster image.
         */
        const info = document.createElement("div");
        info.className = "movie-info";

        /* --- Title (h2 — h1 is reserved for the page header) --- */
        const title = document.createElement("h2");
        title.textContent = movie.Title;
        info.appendChild(title);

        /* --- Released date ---
         *
         * The pattern repeated below for every meta field is:
         *   1. Create a <p> for one line of info.
         *   2. Inside it, a <span class="meta-label"> for the label so
         *      CSS can style it (dimmer, smaller).
         *   3. Append a plain text node for the value.
         *
         * Using textContent (not innerHTML) prevents any HTML in the
         * value from being interpreted as markup.
         */
        const released = document.createElement("p");
        const releasedLabel = document.createElement("span");
        releasedLabel.className = "meta-label";
        releasedLabel.textContent = "Released:";
        released.appendChild(releasedLabel);
        released.append(" " + movie.Released);
        info.appendChild(released);

        /* --- Runtime (number of minutes — we add the "min" unit) --- */
        const runtime = document.createElement("p");
        const runtimeLabel = document.createElement("span");
        runtimeLabel.className = "meta-label";
        runtimeLabel.textContent = "Runtime:";
        runtime.appendChild(runtimeLabel);
        runtime.append(" " + movie.Runtime + " min");
        info.appendChild(runtime);

        /* --- Genres ---
         *
         * Genres is an array (e.g. ["Horror","Mystery","Sci-Fi"]). Each
         * genre gets its own <span class="genre"> styled as a pill in CSS.
         */
        const genresP = document.createElement("p");
        const genresLabel = document.createElement("span");
        genresLabel.className = "meta-label";
        genresLabel.textContent = "Genres:";
        genresP.appendChild(genresLabel);
        genresP.append(" ");
        for (const g of movie.Genres) {
          const span = document.createElement("span");
          span.className = "genre";
          span.textContent = g;
          genresP.appendChild(span);
        }
        info.appendChild(genresP);

        /* --- Directors / Writers / Actors ---
         *
         * Each is an array of names; we display them as a comma-separated
         * string with Array.prototype.join(", ").
         */
        const directors = document.createElement("p");
        const directorsLabel = document.createElement("span");
        directorsLabel.className = "meta-label";
        directorsLabel.textContent = "Directors:";
        directors.appendChild(directorsLabel);
        directors.append(" " + movie.Directors.join(", "));
        info.appendChild(directors);

        const writers = document.createElement("p");
        const writersLabel = document.createElement("span");
        writersLabel.className = "meta-label";
        writersLabel.textContent = "Writers:";
        writers.appendChild(writersLabel);
        writers.append(" " + movie.Writers.join(", "));
        info.appendChild(writers);

        const actors = document.createElement("p");
        const actorsLabel = document.createElement("span");
        actorsLabel.className = "meta-label";
        actorsLabel.textContent = "Actors:";
        actors.appendChild(actorsLabel);
        actors.append(" " + movie.Actors.join(", "));
        info.appendChild(actors);

        /* --- Plot (free text summary) --- */
        const plot = document.createElement("p");
        const plotLabel = document.createElement("span");
        plotLabel.className = "meta-label";
        plotLabel.textContent = "Plot:";
        plot.appendChild(plotLabel);
        plot.append(" " + movie.Plot);
        info.appendChild(plot);

        /* --- Ratings ---
         *
         * Both ratings share one <p> so they sit on the same line. The
         * rating numbers themselves wear class "rating" so CSS can color
         * them green for visual emphasis.
         */
        const ratingsP = document.createElement("p");

        const imdbLabel = document.createElement("span");
        imdbLabel.className = "meta-label";
        imdbLabel.textContent = "IMDb:";
        const imdbValue = document.createElement("span");
        imdbValue.className = "rating";
        imdbValue.textContent = movie.imdbRating;

        const metaLabel = document.createElement("span");
        metaLabel.className = "meta-label";
        metaLabel.textContent = "Metascore:";
        const metaValue = document.createElement("span");
        metaValue.className = "rating";
        metaValue.textContent = movie.Metascore;

        ratingsP.appendChild(imdbLabel);
        ratingsP.append(" ");
        ratingsP.appendChild(imdbValue);
        ratingsP.append("   ");
        ratingsP.appendChild(metaLabel);
        ratingsP.append(" ");
        ratingsP.appendChild(metaValue);
        info.appendChild(ratingsP);

        /*
         * Edit button — navigates to edit.html with the imdbID in the
         * query string so edit.js knows which movie to load and display
         * in its form.
         */
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function () {
          location.href = "edit.html?imdbID=" + movie.imdbID;
        };
        info.appendChild(editButton);

        /* Attach the info column to the card, then the card to the page */
        article.appendChild(info);
        container.appendChild(article);
      }
    } else {
      /* Any non-200 status means something went wrong server-side. */
      container.append(
        "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText
      );
    }
  };

  /*
   * xhr.onerror fires when the request itself could not be sent or no
   * response arrived (server offline, no network). We surface a short
   * message in the container so the user knows something went wrong.
   */
  xhr.onerror = function () {
    document.querySelector("#movies-container").append("Network error: request failed.");
  };

  /*
   * Open and send the GET request. .toString() converts the URL object
   * into a string like "/movies" or "/movies?genre=Action".
   */
  xhr.open("GET", url.toString());
  xhr.send();
}

/*
 * window.onload runs after the HTML document has been fully parsed.
 *
 * It fetches the list of distinct genres from the server, then for
 * each genre creates a <button> in the nav. A leading "All" button
 * is added first so the user can clear the genre filter.
 *
 * After the buttons exist we programmatically click the first one
 * (the "All" button). That click handler calls loadMovies() which
 * performs the initial fetch and render of all movies.
 */
window.onload = function () {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.status === 200) {
      /* The response is a JSON-encoded array of genre name strings. */
      const genres = JSON.parse(xhr.responseText);
      const nav = document.querySelector("#genre-nav");

      /*
       * "All" button — must come first so that clicking the first
       * button below loads the unfiltered list. Calling loadMovies()
       * with no argument means no ?genre= parameter is sent.
       */
      const allBtn = document.createElement("button");
      allBtn.textContent = "All";
      allBtn.onclick = function () { loadMovies(); };
      nav.appendChild(allBtn);

      /*
       * One button per genre. The closure over `genre` captures the
       * specific value for each iteration so each button filters by
       * its own genre name (not the last one in the loop).
       */
      for (const genre of genres) {
        const btn = document.createElement("button");
        btn.textContent = genre;
        btn.onclick = function () { loadMovies(genre); };
        nav.appendChild(btn);
      }

      /*
       * Trigger the initial render by clicking the first button (the
       * "All" button we appended first). Doing this here — rather than
       * calling loadMovies() directly — keeps the "click a button to
       * load movies" flow consistent across user actions and startup.
       */
      nav.querySelector("button").click();
    }
  };

  xhr.onerror = function () {
    document.querySelector("#movies-container").append("Network error: request failed.");
  };

  xhr.open("GET", "/genres");
  xhr.send();
};

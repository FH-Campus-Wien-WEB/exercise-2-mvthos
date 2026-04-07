/*
 * Fetch and render all movies on page load.
 *
 * This code was originally inline in index.html (Exercise 1) and has been
 * moved to a separate .js file. It uses XMLHttpRequest (XHR) to fetch
 * movie data from the server, then dynamically builds the DOM for each movie.
 */
window.onload = function () {
  /*
   * XMLHttpRequest (XHR) is the classic browser API for making
   * HTTP requests without navigating away from the page (AJAX).
   */
  const xhr = new XMLHttpRequest();

  /*
   * xhr.onload is a callback — a function the browser calls when
   * the response has fully arrived from the server.
   */
  xhr.onload = function () {
    /*
     * We target the <main id="movies-container"> element instead of
     * appending directly to <body>. This is cleaner structurally.
     */
    const container = document.querySelector("#movies-container");

    if (xhr.status === 200) {
      /*
       * HTTP 200 means "OK" — the server responded successfully.
       * xhr.responseText contains the raw JSON text; JSON.parse()
       * converts it into JavaScript objects we can work with.
       */
      const movies = JSON.parse(xhr.responseText);

      /*
       * Loop over every movie and build a card for it.
       */
      for (const movie of movies) {
        /*
         * <article> is the semantically correct element for a
         * self-contained piece of content like a movie card.
         * The id is set to the imdbID so each movie element
         * can be identified in the DOM.
         */
        const article = document.createElement("article");
        article.id = movie.imdbID;

        /* --- Poster image --- */
        const img = document.createElement("img");
        img.src = movie.Poster;
        img.alt = movie.Title + " poster";

        /*
         * onerror fires if the image URL is broken or the network
         * request fails. We hide the element to keep the card clean.
         */
        img.onerror = function () {
          img.style.display = "none";
        };

        article.appendChild(img);

        /*
         * A plain <div> groups all the text fields together so flexbox
         * in CSS can place them next to the poster image as one column.
         */
        const info = document.createElement("div");
        info.className = "movie-info";

        /* --- Title --- */
        /*
         * <h2> is used (not <h1>) because each movie is a card
         * within the page, so <h2> is the correct heading level.
         */
        const title = document.createElement("h2");
        title.textContent = movie.Title;
        info.appendChild(title);

        /* --- Released date --- */
        /*
         * Each info line is a <p> containing a label <span> and a text
         * node for the value. We use textContent (not innerHTML) so no
         * raw HTML is ever interpreted — safer and more explicit.
         */
        const released = document.createElement("p");
        const releasedLabel = document.createElement("span");
        releasedLabel.className = "meta-label";
        releasedLabel.textContent = "Released:";
        released.appendChild(releasedLabel);
        released.append(" " + movie.Released);
        info.appendChild(released);

        /* --- Runtime --- */
        const runtime = document.createElement("p");
        const runtimeLabel = document.createElement("span");
        runtimeLabel.className = "meta-label";
        runtimeLabel.textContent = "Runtime:";
        runtime.appendChild(runtimeLabel);
        /* movie.Runtime is a number (e.g. 109), so we add ' min' as the unit */
        runtime.append(" " + movie.Runtime + " min");
        info.appendChild(runtime);

        /* --- Genres --- */
        /*
         * Genres is an array (e.g. ["Horror", "Mystery", "Sci-Fi"]).
         * Each genre gets its own <span class="genre"> styled as a pill.
         */
        const genresP = document.createElement("p");
        const genresLabel = document.createElement("span");
        genresLabel.className = "meta-label";
        genresLabel.textContent = "Genres:";
        genresP.appendChild(genresLabel);
        genresP.append(" ");
        for (const genre of movie.Genres) {
          const span = document.createElement("span");
          span.className = "genre";
          span.textContent = genre;
          genresP.appendChild(span);
        }
        info.appendChild(genresP);

        /* --- Directors, Writers, Actors --- */
        /*
         * These are also arrays, but displayed as comma-separated
         * lists rather than pills — join(", ") is the simplest approach.
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

        /* --- Plot --- */
        const plot = document.createElement("p");
        const plotLabel = document.createElement("span");
        plotLabel.className = "meta-label";
        plotLabel.textContent = "Plot:";
        plot.appendChild(plotLabel);
        plot.append(" " + movie.Plot);
        info.appendChild(plot);

        /* --- Ratings --- */
        /*
         * Both ratings go into a single <p> so they sit on the same line.
         * Each label and value is its own element — no raw HTML strings.
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
         * Edit button — navigates to edit.html with the movie's
         * imdbID passed as a query parameter so the edit page knows
         * which movie to load and display in the form.
         */
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function () {
          location.href = "edit.html?imdbID=" + movie.imdbID;
        };
        info.appendChild(editButton);

        /* Attach the info div to the article, then the article to the page */
        article.appendChild(info);
        container.appendChild(article);
      }
    } else {
      /* Any status other than 200 means something went wrong */
      container.append(
          "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText
      );
    }
  };

  /*
   * xhr.onerror fires when the request cannot be completed at all —
   * e.g. if the server is offline or there is no network connection.
   */
  xhr.onerror = function () {
    document.querySelector("#movies-container").append("Network error: request failed.");
  };

  /*
   * Configure and send the GET request to /movies.
   * The browser will call xhr.onload when the response arrives.
   */
  xhr.open("GET", "/movies");
  xhr.send();
};

/*
 * Movie data model
 *
 * Movies are stored as a JavaScript object where each key is the imdbID
 * and the value is the full movie object. This structure allows O(1)
 * lookup by imdbID (e.g. movieModel["tt0084787"]), while Object.values()
 * can convert it to an array when needed for the GET /movies endpoint.
 *
 * The movie data was originally defined inline in server.js (Exercise 1)
 * and has now been moved here into its own module for better separation
 * of concerns. Each movie now also includes an imdbID property.
 */

const movies = {
  /* The Thing (1982) — Horror/Mystery/Sci-Fi classic by John Carpenter */
  tt0084787: {
    imdbID: "tt0084787",
    Title: "The Thing",
    Released: "1982-06-25",
    Runtime: 109,
    Genres: ["Horror", "Mystery", "Sci-Fi"],
    Directors: ["John Carpenter"],
    Writers: ["Bill Lancaster", "John W. Campbell Jr."],
    Actors: ["Kurt Russell", "Wilford Brimley", "Keith David"],
    Plot: "A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.",
    Poster: "https://m.media-amazon.com/images/M/MV5BNGViZWZmM2EtNGYzZi00ZDAyLTk3ODMtNzIyZTBjN2Y1NmM1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
    Metascore: 57,
    imdbRating: 8.2,
  },

  /* Star Wars: Episode IV — A New Hope (1977) — Action/Adventure/Fantasy */
  tt0076759: {
    imdbID: "tt0076759",
    Title: "Star Wars: Episode IV - A New Hope",
    Released: "1977-05-25",
    Runtime: 121,
    Genres: ["Action", "Adventure", "Fantasy"],
    Directors: ["George Lucas"],
    Writers: ["George Lucas"],
    Actors: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
    Plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
    Poster: "https://m.media-amazon.com/images/M/MV5BOGUwMDk0Y2MtNjBlNi00NmRiLTk2MWYtMGMyMDlhYmI4ZDBjXkEyXkFqcGc@._V1_SX300.jpg",
    Metascore: 92,
    imdbRating: 8.6,
  },

  /* Guardians of the Galaxy Vol. 2 (2017) — Action/Adventure/Comedy */
  tt3896198: {
    imdbID: "tt3896198",
    Title: "Guardians of the Galaxy Vol. 2",
    Released: "2017-05-05",
    Runtime: 136,
    Genres: ["Action", "Adventure", "Comedy"],
    Directors: ["James Gunn"],
    Writers: ["James Gunn", "Dan Abnett", "Andy Lanning"],
    Actors: ["Chris Pratt", "Zoe Saldana", "Dave Bautista"],
    Plot: "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father the ambitious celestial being Ego.",
    Poster: "https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00YzEwLWE0YmUtNTA2ZWIzODc2OTgxXkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg",
    Metascore: 67,
    imdbRating: 7.6,
  },
};

/*
 * Export the movies object using CommonJS (module.exports).
 * server.js imports this with require('./movie-model.js').
 */
module.exports = movies;

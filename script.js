const API_KEY = "7ee2ee86";

const moviesGrid = document.querySelector("#moviesGrid");

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

const sortSelect = document.querySelector("#sortSelect");
let currentMovies = [];

const resultsInfo = document.querySelector("#resultsInfo");

sortSelect.addEventListener("change", renderMovies);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchMovies(searchInput.value);
});

async function searchMovies(query) {
  showSkeletons();
  resultsInfo.innerHTML = `<span>Showing: </span>${query}`
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
  );
  const data = await response.json();
  if (data.Response === "False") {
    moviesGrid.innerHTML = `<p>No movies found.</p>`;
    return;
  }
  currentMovies = data.Search;
  renderMovies();
}

searchMovies("marvel");

function movieHTML(movie) {
  return `
  <div class="movie-card">
  ${
    movie.Poster !== "N/A"
      ? `<img class="movie-card__img" src="${movie.Poster}" alt="${movie.Title}" />`
      : `<div class="movie-card__poster-placeholder">Movie Poster<br />Not Available</div>`
  }
    <h2 class="movie-card__title">${movie.Title}</h2>
    <p class="movie-card__year">${movie.Year}</p>
  </div>
  `;
}

function showSkeletons() {
  moviesGrid.innerHTML = new Array(10)
    .fill(0)
    .map(
      () => `
    <div class="movie-card movie-card--skeleton">
      <div class="movie-card__img--skeleton"></div>
      <div class="movie-card__title--skeleton"></div>
      <div class="movie-card__year--skeleton"></div>
    </div>
  `,
    )
    .join("");
}

function renderMovies() {
  const sorted = [...currentMovies];
  const sortBy = sortSelect.value;

  if (sortBy === "a-z") {
    sorted.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "z-a") {
    sorted.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortBy === "newest") {
    sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sortBy === "oldest") {
    sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  moviesGrid.innerHTML = sorted.map((movie) => movieHTML(movie)).join("");
}

let spinner = document.querySelector(".spinner");
const global = {
  currentPage: window.location.pathname,
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzBhY2IyNTAxYjRjNmI2MjdlM2FiOTBmOTI0NDM2NiIsInN1YiI6IjY0YzI5OGU2MmYxYmUwMDEyZDkxZDBhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qKQv1qDx56gTmcf-6y3gVGuJMLb-U7JN0UUcsBEww2o",
  },
};

async function fetchAPIData(endpoint) {
  showSpinner();
  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}`,
    options
  );
  const data = await response.json();
  hideSpinner();
  return data;
}
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");
  console.log(results);
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="moviedetails.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${result.title}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${result.title}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${result.release_date}</small>
            </p>
          </div>
        `;

    document.querySelector("#popular-movies").appendChild(div);
  });
}
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");
  console.log(results);
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="show-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${result.name}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${result.name}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                result.first_air_date
              }</small>
            </p>
          </div>
        `;

    document.querySelector("#popular-shows").appendChild(div);
  });
}

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background image
  // displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<a href="${movie.homepage}" target="_blank" > <img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.title}"
    /></a>`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${movie.title}"
/>`
  }
 
  </div>
  <div class="details-middle">
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <div class="button btn">
    <a href="${movie.homepage}" target="_blank" >Visit Movie Homepage</a>
    </div>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${movie.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(", ")}
  </div>
</div>
  `;

  document.querySelector("#movie-details").appendChild(div);
}

function highlightActiveLink() {
  let links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      let href = link.getAttribute("href");
      link.classList.add("active");
      console.log(href);
    } else if (global.currentPage === "/show-details.html") {
      link.classList.add("active");
    }

    let href = link.getAttribute("href");
    console.log(href);
  });
}
function showSpinner() {
  spinner.classList.add("show");
}
function hideSpinner() {
  spinner.classList.remove("show");
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function init() {
  switch (global.currentPage) {
    case "/moviedetails.html":
      console.log("Movie details");
      console.log(global.currentPage);
      displayMovieDetails();
      break;
    case "/index.html":
    case "/":
      console.log("Home");
      displayPopularMovies();

      break;
    case "/shows.html":
      console.log("shows");
      displayPopularShows();

      break;
    case "/show-details.html":
      console.log("Show Details");
      break;
    case "/search.html":
      console.log("Search");
      break;
  }
  highlightActiveLink();
}

window.addEventListener("DOMContentLoaded", init);
// window.addEventListener("DOMContentLoaded", highlightActiveLink);

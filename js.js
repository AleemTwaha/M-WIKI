let spinner = document.querySelector(".spinner");
const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    // Register your key at https://www.themoviedb.org/settings/api and enter here
    // Only use this for development or very small projects. You should store your key and make requests from a server
    apiKey: "a30acb2501b4c6b627e3ab90f9244366",
    apiUrl: "https://api.themoviedb.org/3/",
  },
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
            src="./no-image.jpg"
            class="card-img-top"
            alt="${result.title}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="card-text">
              <small >Release: ${result.release_date}</small>
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
    <div class="imgContainer">
          <a href="tvdetails.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${result.name}"
            />`
                : `<img
            src="./no-image.jpg"
            class="card-img-top"
            alt="${result.name}"
          />`
            }
          </a>
          </div>
          <div class="card-body">
            <h5 class="card-title">${result.name}</h5>
            <p class="card-text">
              <small>Release: ${result.first_air_date}</small>
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
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<a href="${movie.homepage}" target="_blank" > <img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top details"
      alt="${movie.title}"
    /></a>`
      : `<img
  src="./no-image.jpg"
  class="card-img-top details"
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
    <p Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${movie.homepage}" target="_blank" >
    <div class="button btn">
    Visit Movie Homepage
    </div>
    </a>
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

  document.querySelector(".movie-details").appendChild(div);
}

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    show.poster_path
      ? `<a href="${show.homepage}" target="_blank" > <img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top details"
      alt="${show.name}"
    /></a>`
      : `<img
  src="./no-image.jpg"
  class="card-img-top details"
  alt="${show.name}"
/>`
  }
 
  </div>
  <div class="details-middle">
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p>Last Air Date Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${show.homepage}" target="_blank" >
    <div class="button btn">
    Visit Movie Homepage
    </div>
    </a>
  </div>
  </div>
  <div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">No.of Episodes:</span> ${
      show.number_of_episodes
    }
      
  </li>
    <li><span class="text-secondary">Last Episode on:</span> ${
      show.last_episode_to_air.name
    }
    </li>
  
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(", ")}
  </div>
</div>

  `;

  document.querySelector(".show-details").appendChild(div);
}
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100%";
  overlayDiv.style.width = "100%";
  overlayDiv.style.maxHeight = "889px";

  overlayDiv.style.maxWidth = "100%";
  overlayDiv.style.minWidth = "auto";

  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "2rem";
  overlayDiv.style.left = "0";
  overlayDiv.style.border = "0.5rem solid var(--color-secondary)";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";
  if (type === "movie") {
    document.querySelector(".movie-details").appendChild(overlayDiv);
  } else {
    overlayDiv.style.maxHeight = "830px";
    document.querySelector(".show-details").appendChild(overlayDiv);
  }
}

async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="moviedetails.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}
async function displayShowSlider() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="tvdetails.html?id=${result.id}">
        <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.name}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");
  console.log(global.search.term);
  console.log(global.search.type);

  if (global.search.term !== "" || global.search.term !== null) {
    const { results, total_pages, page, total_results } = await fetchAPIData(
      `search/${global.search.type}?language=en-US&query=${global.search.term}&page=${global.search.page}`
    );
    console.log(results);
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("select the type");
  }
}
// async function searchAPIData() {
//   const API_KEY = global.api.apiKey;
//   const API_URL = global.api.apiUrl;

//   showSpinner();

//   const response = await fetch(
//     `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
//   );

//   const data = await response.json();

//   hideSpinner();

//   return data;
// }

function displaySearchResults(results) {
  // Clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  console.log(results);

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="${global.search.type}details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
            />`
                : `<img
            src="./no-image.jpg"
            class="card-img-top"
             alt="${
               global.search.type === "movie" ? result.title : result.name
             }"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === "movie"
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
        `;

    document.querySelector("#search-results-heading").innerHTML = `
              <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}

// Create & Display Pagination For Search
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="btn " id="prev">Prev</button>
  <button class="btn " id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await fetchAPIData(
      `search/${global.search.type}?language=en-US&query=${global.search.term}&page=${global.search.page}`
    );
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await fetchAPIData(
      `search/${global.search.type}?language=en-US&query=${global.search.term}&page=${global.search.page}`
    );
    displaySearchResults(results);
  });
}
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 40,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

function highlightActiveLink() {
  let links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      let href = link.getAttribute("href");
      link.classList.add("active");
      console.log(href);
    }
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

const button = document.querySelector(".btn");

const radioShow = document.querySelector(".radioShow");
const radioMovie = document.querySelector(".radioMovie");
if (radioMovie && radioShow) {
  radioMovie.addEventListener("click", () => {
    radioShow.checked = false;
  });
  radioShow.addEventListener("click", () => {
    radioMovie.checked = false;
  });
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
      displaySlider();
      displayPopularMovies();
      // search();

      break;
    case "/shows.html":
      console.log("shows");
      displayShowSlider();
      displayPopularShows();

      break;
    case "/tvdetails.html":
      console.log("Show Details");
      displayShowDetails();
      break;
    case "/search.html":
      search();
      console.log(window.location.href);

      break;
  }
  highlightActiveLink();
}

window.addEventListener("DOMContentLoaded", init);

// window.addEventListener("DOMContentLoaded", highlightActiveLink);

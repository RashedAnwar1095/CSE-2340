const API_KEY = "7a5f43a05f55419c871d1abe3abb8cce";
const BASE_URL = "https://api.rawg.io/api/games";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const homeBtn = document.getElementById("homeBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const sectionTitle = document.getElementById("sectionTitle");
const message = document.getElementById("message");
const gameGrid = document.getElementById("gameGrid");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.getElementById("closeBtn");
const genreSelect = document.getElementById("genreSelect");

let allGames = [];
let favorites = [];
let currentPage = "browse";

function loadFavorites() {
    const savedText = localStorage.getItem("favoriteGames");
    if (savedText !== null) {
        favorites = JSON.parse(savedText);
    }
}

function saveFavorites() {
    localStorage.setItem("favoriteGames", JSON.stringify(favorites));
}

function isFavorite(gameId) {
    const found = favorites.find(function (game) {
        return game.id === gameId;
    });

    if (found) {
        return true;
    }
    else {
        return false;
    }
}

function toggleFavorite(game) {
    if (isFavorite(game.id)) {
        favorites = favorites.filter(function (item) {
            return item.id !== game.id;
        });
    }
    else {
        const gameToSave = {
            id: game.id,
            name: game.name,
            background_image: game.background_image,
            rating: game.rating,
            released: game.released
        };
        favorites.push(gameToSave);
    }
    saveFavorites();

    if (currentPage === "favorites") {
        showGames(favorites);
    }
    else {
        showGames(allGames);
    }
}

async function loadGames(searchText, genre) {
    message.textContent = "Loading games...";
    message.className = "message";
    gameGrid.innerHTML = "";

    let url = BASE_URL + "?key=" + API_KEY + "&page_size=20";
    if (searchText !== "") {
        url = url + "&search=" + encodeURIComponent(searchText);
    }
    if (genre !== "") {
        url = url + "&genres=" + genre;
    }

    try {
        const response = await fetch(url);

        if (response.ok === false) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();
        allGames = data.results;

        message.textContent = "";
        showGames(allGames);
    }
    catch (error) {
        message.textContent = "Could not load games. Check your internet or API key.";
        message.className = "message error";
        console.log(error);
    }
}

async function loadGameDetails(gameId) {
    modal.classList.remove("hidden");
    modalContent.innerHTML = "<p>Loading details...</p>";

    try {
        const url = BASE_URL + "/" + gameId + "?key=" + API_KEY;
        const response = await fetch(url);

        if (response.ok === false) {
            throw new Error("Server error: " + response.status);
        }

        const game = await response.json();
        showDetails(game);
    }
    catch (error) {
        modalContent.innerHTML = "<p>Could not load game details.</p>";
        console.log(error);
    }
}

function showGames(list) {
    gameGrid.innerHTML = "";

    if (list.length === 0) {
        if (currentPage === "favorites") {
            message.textContent = "You have no favorite games yet.";
        }
        else {
            message.textContent = "No games found. Try another name.";
        }
        return;
    }

    message.textContent = "";

    list.forEach(function (game) {
        const card = createCard(game);
        gameGrid.appendChild(card);
    });
}

function createCard(game) {
    const card = document.createElement("div");
    card.className = "game-card";

    let imageHtml = '<div class="no-image">No image</div>';
    if (game.background_image) {
        imageHtml = '<img src="' + game.background_image + '" alt="' + game.name + '">';
    }

    let favText = "Add to Favorites";
    let favClass = "fav-btn";
    if (isFavorite(game.id)) {
        favText = "Remove from Favorites";
        favClass = "fav-btn saved";
    }

    card.innerHTML =
        '<div class="click-area">' +
        imageHtml +
        '<div class="card-info">' +
        "<h3>" + game.name + "</h3>" +
        "<p>Rating: " + game.rating + " / 5</p>" +
        "<p>Released: " + game.released + "</p>" +
        "</div>" +
        "</div>" +
        '<button class="' + favClass + '">' + favText + "</button>";

    const clickArea = card.querySelector(".click-area");
    clickArea.addEventListener("click", function () {
        loadGameDetails(game.id);
    });

    const favButton = card.querySelector(".fav-btn");
    favButton.addEventListener("click", function () {
        toggleFavorite(game);
    });

    return card;
}

function showDetails(game) {
    let genreNames = "Not available";
    if (game.genres.length > 0) {
        genreNames = game.genres.map(function (genre) {
            return genre.name;
        }).join(", ");
    }

    let platformNames = "Not available";
    if (game.platforms && game.platforms.length > 0) {
        platformNames = game.platforms.map(function (item) {
            return item.platform.name;
        }).join(", ");
    }

    let description = "No description available.";
    if (game.description_raw) {
        description = game.description_raw.slice(0, 500) + "...";
    }

    let imageHtml = "";
    if (game.background_image) {
        imageHtml = '<img src="' + game.background_image + '" alt="' + game.name + '">';
    }

    modalContent.innerHTML =
        "<h2>" + game.name + "</h2>" +
        imageHtml +
        "<p><strong>Rating:</strong> " + game.rating + " / 5</p>" +
        "<p><strong>Released:</strong> " + game.released + "</p>" +
        "<p><strong>Genres:</strong> " + genreNames + "</p>" +
        "<p><strong>Platforms:</strong> " + platformNames + "</p>" +
        "<p>" + description + "</p>";
}

function runSearch()
{
    const text = searchInput.value.trim();
    const genre = genreSelect.value;

    currentPage = "browse";
    homeBtn.classList.add("active");
    favoritesBtn.classList.remove("active");

    let title = "Popular Games";
    if(text !== "")
    {
        title = 'Results for "' + text + '"';
    }
    if(genre !== "")
    {
        const genreName = genreSelect.options[genreSelect.selectedIndex].text;
        title = title + " - " + genreName;
    }
    sectionTitle.textContent = title;

    loadGames(text, genre);
}

searchBtn.addEventListener("click", runSearch);
genreSelect.addEventListener("change", runSearch);

searchInput.addEventListener("keydown", function (event)
{
    if (event.key === "Enter")
    {
        searchBtn.click();
    }
});

homeBtn.addEventListener("click", function () {
    currentPage = "browse";
    homeBtn.classList.add("active");
    favoritesBtn.classList.remove("active");
    sectionTitle.textContent = "Popular Games";
    searchInput.value = "";
    genreSelect.value = "";
    loadGames("", "");
});

favoritesBtn.addEventListener("click", function () {
    currentPage = "favorites";
    favoritesBtn.classList.add("active");
    homeBtn.classList.remove("active");
    sectionTitle.textContent = "My Favorite Games";
    showGames(favorites);
});

closeBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
});

loadFavorites();
loadGames("", "");
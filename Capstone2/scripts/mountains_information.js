// Retrieve the mountain select dropdown element
var mountainSelect = document.getElementById("mountainSelect");

// Function to populate the dropdown menu with mountain options
function populateMountainDropdown() {
  // Sort the mountainsArray alphabetically by name (ignoring "Mt. ")
  mountainsArray.sort(function (a, b) {
    var nameA = a.name.replace(/^Mt\. /i, "").toLowerCase();
    var nameB = b.name.replace(/^Mt\. /i, "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Add "All" option
  var allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All";
  mountainSelect.appendChild(allOption);

  for (var mountain of mountainsArray) {
    var option = document.createElement("option");
    option.value = mountain.name;
    option.textContent = mountain.name;
    mountainSelect.appendChild(option);
  }
}



// Function to save favorited cards as a CSV file
function saveFavoritesAsCSV() {
  // Filter the favorite cards
  var favoriteCards = document.querySelectorAll(".card.favorite");

  // Create a CSV string with the card details
  var csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Description,Elevation\n"; // CSV header

  for (var card of favoriteCards) {
    var name = card.querySelector(".card-title").textContent;
    var desc = card.querySelector(".card-text").textContent;
    var elevation = card.querySelector(".card-text.card-elevation").textContent;

    var row = [name, desc, elevation];
    csvContent += row.join(",") + "\n";
  }

  // Create a Blob object with the CSV data
  var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Generate a temporary URL for the Blob object
  var url = URL.createObjectURL(blob);

  // Create a link element and set its attributes
  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "favorites.csv");

  // Simulate a click on the link to start the download
  link.click();
}

// Function to display favorite cards
function displayFavoriteCards() {
  // Filter the favorite cards
  var favoriteCards = document.querySelectorAll(".card.favorite");

  // Clear existing cards
  var mountainDetails = document.getElementById("mountainDetails");
  mountainDetails.innerHTML = "";

  // Create a row div to hold the favorite cards
  var rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  for (var card of favoriteCards) {
    rowDiv.appendChild(card);
  }

  mountainDetails.appendChild(rowDiv);
}

// Function to display mountain information based on the selected mountain
function displayMountainDetails() {
  var selectedMountain = mountainSelect.value;
  var mountainDetails = document.getElementById("mountainDetails");

  // Clear existing cards and sunrise/sunset information
  mountainDetails.innerHTML = "";

  if (selectedMountain === "all" || selectedMountain === "") {
    // Show all mountains
    var mountainRows = chunkArray(mountainsArray, 3);
    for (var row of mountainRows) {
      var rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      for (var mountain of row) {
        var card = createMountainCard(mountain);
        rowDiv.appendChild(card);
      }

      mountainDetails.appendChild(rowDiv);
    }
  } else {
    // Find the selected mountain in the mountainsArray
    var selectedMountainObj = mountainsArray.find(function (mountain) {
      return mountain.name === selectedMountain;
    });
    if (selectedMountainObj) {
      var card = createMountainCard(selectedMountainObj);
      mountainDetails.appendChild(card);
    }
  }

  // Check if any favorites exist
  var favoriteCards = document.querySelectorAll(".card.favorite");
  if (favoriteCards.length === 0) {
    // No favorites, hide the "Favorites" section
    var favoritesSection = document.getElementById("favoritesSection");
    favoritesSection.style.display = "none";
  } else {
    // Favorites exist, show the "Favorites" section
    var favoritesSection = document.getElementById("favoritesSection");
    favoritesSection.style.display = "block";
  }
}

// Function to chunk an array into smaller arrays of a specified size
function chunkArray(arr, size) {
  var chunkedArr = [];
  for (var i = 0; i < arr.length; i += size) {
    var chunk = arr.slice(i, i + size);
    chunkedArr.push(chunk);
  }
  return chunkedArr;
}

// Function to create a mountain card
function createMountainCard(mountain) {
  var card = document.createElement("div");
  card.classList.add("card", "col-md-4", "mb-3");

  var cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header", "d-flex", "justify-content-between", "align-items-center");

  var lockIcon = document.createElement("i");
  lockIcon.classList.add("fa", "fa-lock", "card-lock");

  var closeIcon = document.createElement("i");
  closeIcon.classList.add("fa", "fa-times", "card-close");

  var starButtonContainer = document.createElement("div");
  starButtonContainer.classList.add("star-button-container");

  var starButton = document.createElement("button");
  starButton.classList.add("star-button");

  var starIcon = document.createElement("img");
  starIcon.src = "images/star_unfav.png";
  starIcon.alt = "Star";

  starButton.appendChild(starIcon);
  starButtonContainer.appendChild(starButton);
  cardHeader.appendChild(starButtonContainer);
  cardHeader.appendChild(lockIcon);
  cardHeader.appendChild(closeIcon);

  var cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  var cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = mountain.name;

  var cardImg = document.createElement("img");
  cardImg.classList.add("card-img-top");
  cardImg.src = mountain.img;
  cardImg.alt = mountain.name;

  var cardDesc = document.createElement("p");
  cardDesc.classList.add("card-text");
  cardDesc.textContent = mountain.desc;

  var cardElevation = document.createElement("p");
  cardElevation.classList.add("card-text");
  cardElevation.classList.add("card-elevation");
  cardElevation.textContent = "Elevation: " + mountain.elevation;

  var cardSunriseSunset = document.createElement("p");
  cardSunriseSunset.classList.add("card-text", "font-weight-bold");
  cardSunriseSunset.textContent = "Sunrise and Sunset: Calculating...";

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardImg);
  cardBody.appendChild(cardDesc);
  cardBody.appendChild(cardElevation);
  cardBody.appendChild(cardSunriseSunset);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  // Get latitude and longitude for the mountain
  var latitude = mountain.coords.lat;
  var longitude = mountain.coords.lng;

  // Get sunrise and sunset times for the mountain
  getSunriseAndSunsetForMountain(latitude, longitude)
    .then(function (sunriseAndSunset) {
      cardSunriseSunset.innerHTML =
        "Sunrise and Sunset: <span class=\"sunrise-sunset-text\">" + sunriseAndSunset + "</span>";
    })
    .catch(function (error) {
      console.error(error);
      cardSunriseSunset.innerHTML =
        "Sunrise and Sunset: <span class=\"sunrise-sunset-error\">" + error.message + "</span>";
    });

  // Toggle the .favorite class and change the star image when clicked
  starButton.addEventListener("click", function () {
    card.classList.toggle("favorite");
    if (card.classList.contains("favorite")) {
      starIcon.src = "images/star_fav.png";
    } else {
      starIcon.src = "images/star_unfav.png";
    }
  });

  return card;
}

// Retrieve the mountain select dropdown element
var mountainSelect = document.getElementById("mountainSelect");

// Function to populate the dropdown menu with mountain options
function populateMountainDropdown() {
  // Sort the mountainsArray alphabetically by name (ignoring "Mt. ")
  mountainsArray.sort(function (a, b) {
    var nameA = a.name.replace(/^Mt\. /i, "").toLowerCase();
    var nameB = b.name.replace(/^Mt\. /i, "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Add "All" option
  var allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All";
  mountainSelect.appendChild(allOption);

  for (var mountain of mountainsArray) {
    var option = document.createElement("option");
    option.value = mountain.name;
    option.textContent = mountain.name;
    mountainSelect.appendChild(option);
  }

  // Create the "Favorites" option in the dropdown
  var favoritesOption = document.createElement("option");
  favoritesOption.value = "favorites";
  favoritesOption.textContent = "Favorites";
  mountainSelect.appendChild(favoritesOption);
}

// Function to display favorite cards
function displayFavoriteCards() {
  // Filter the favorite cards
  var favoriteCards = document.querySelectorAll(".card.favorite");

  // Clear existing cards
  var mountainDetails = document.getElementById("mountainDetails");
  mountainDetails.innerHTML = "";

  // Create a row div to hold the favorite cards
  var rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  for (var card of favoriteCards) {
    rowDiv.appendChild(card);
  }

  mountainDetails.appendChild(rowDiv);
}

// Function to display mountain information based on the selected mountain
function displayMountainDetails() {
  var selectedMountain = mountainSelect.value;
  var mountainDetails = document.getElementById("mountainDetails");

  // Clear existing cards and sunrise/sunset information
  mountainDetails.innerHTML = "";

  if (selectedMountain === "all" || selectedMountain === "") {
    // Show all mountains
    var mountainRows = chunkArray(mountainsArray, 3);
    for (var row of mountainRows) {
      var rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      for (var mountain of row) {
        var card = createMountainCard(mountain);
        rowDiv.appendChild(card);
      }

      mountainDetails.appendChild(rowDiv);
    }
  } else if (selectedMountain === "favorites") {
    // Display favorite cards
    displayFavoriteCards();
  } else {
    // Find the selected mountain in the mountainsArray
    var selectedMountainObj = mountainsArray.find(function (mountain) {
      return mountain.name === selectedMountain;
    });
    if (selectedMountainObj) {
      var card = createMountainCard(selectedMountainObj);
      mountainDetails.appendChild(card);
    }
  }

  // Check if any favorites exist
  var favoriteCards = document.querySelectorAll(".card.favorite");
  if (favoriteCards.length === 0) {
    // No favorites, hide the "Favorites" section
    var favoritesSection = document.getElementById("favoritesSection");
    favoritesSection.style.display = "none";
  } else {
    // Favorites exist, show the "Favorites" section
    var favoritesSection = document.getElementById("favoritesSection");
    favoritesSection.style.display = "block";
  }
}

// Event listener for when the page is fully loaded
window.addEventListener("load", function () {
  // Call the function to populate the mountain dropdown initially
  populateMountainDropdown();

  // Set the dropdown value to "all"
  mountainSelect.value = "all";

  // Display all mountains initially
  displayMountainDetails();
});

// Event listener for when the mountain select dropdown changes
mountainSelect.addEventListener("change", displayMountainDetails);

// Function to get sunrise and sunset times for a mountain
async function getSunriseAndSunsetForMountain(lat, lng) {
  try {
    var response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
    var data = await response.json();

    if (response.ok) {
      var sunriseUTC = new Date(data.results.sunrise);
      var sunsetUTC = new Date(data.results.sunset);

      var options = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour: "2-digit",
        minute: "2-digit"
      };

      var sunriseTime = sunriseUTC.toLocaleTimeString([], options);
      var sunsetTime = sunsetUTC.toLocaleTimeString([], options);

      return `${sunriseTime} to ${sunsetTime}`;
    } else {
      throw new Error("Failed to retrieve sunrise and sunset data");
    }
  } catch (error) {
    console.error(error);
    return "Error retrieving sunrise and sunset data";
  }
}

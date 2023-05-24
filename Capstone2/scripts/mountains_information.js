// Retrieve the mountain select dropdown element
var mountainSelect = document.getElementById("mountainSelect");

// Function to populate the dropdown menu with mountain options
function populateMountainDropdown() {
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

async function getSunriseAndSunsetForMountain(lat, lng) {
  try {
    var response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
    var data = await response.json();

    if (response.ok) {
      var sunriseUTC = new Date(data.results.sunrise);
      var sunsetUTC = new Date(data.results.sunset);

      var options = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour: '2-digit',
        minute: '2-digit'
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


// Function to display mountain information based on the selected mountain
function displayMountainDetails() {
  var selectedMountain = mountainSelect.value;
  var mountainDetails = document.getElementById("mountainDetails");

  // Clear existing cards and sunrise/sunset information
  mountainDetails.innerHTML = "";

  if (selectedMountain === "all") {
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
    var selectedMountainObj = mountainsArray.find(function(mountain) {
      return mountain.name === selectedMountain;
    });
    if (selectedMountainObj) {
      var card = createMountainCard(selectedMountainObj);
      mountainDetails.appendChild(card);
    }
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
  cardElevation.textContent = "Elevation: " + mountain.elevation;

  var cardSunriseSunset = document.createElement("p");
  cardSunriseSunset.classList.add("card-text", "font-weight-bold");
  cardSunriseSunset.textContent = "Sunrise and Sunset: Calculating...";

  cardHeader.appendChild(lockIcon);
  cardHeader.appendChild(closeIcon);
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
    .then(function(sunriseAndSunset) {
      cardSunriseSunset.innerHTML = "Sunrise and Sunset: <span class=\"sunrise-sunset-text\">" + sunriseAndSunset + "</span>";
    })
    .catch(function(error) {
      console.error(error);
      cardSunriseSunset.innerHTML = "Sunrise and Sunset: <span class=\"sunrise-sunset-error\">" + error.message + "</span>";
    });

  return card;
}

// Event listener for when the mountain select dropdown changes
mountainSelect.addEventListener("change", displayMountainDetails);

// Call the function to populate the mountain dropdown initially
populateMountainDropdown();

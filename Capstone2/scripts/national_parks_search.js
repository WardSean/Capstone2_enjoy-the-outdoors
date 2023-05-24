// Retrieve the search form element and search results container
const searchForm = document.getElementById("searchForm");
const searchResults = document.getElementById("searchResults");

// Function to populate the location select dropdown
function populateLocationDropdown() {
  const locationDropdown = document.getElementById("location");

  // Add an empty option for searching by location
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Select Location";
  locationDropdown.appendChild(emptyOption);

  for (const location of locationsArray) {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationDropdown.appendChild(option);
  }
}

// Function to populate the park type select dropdown
function populateParkTypeDropdown() {
  const parkTypeDropdown = document.getElementById("parkType");

  // Add an empty option for searching by park type
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Select Park Type";
  parkTypeDropdown.appendChild(emptyOption);

  for (const parkType of parkTypesArray) {
    const option = document.createElement("option");
    option.value = parkType;
    option.textContent = parkType;
    parkTypeDropdown.appendChild(option);
  }
}

// Function to handle the form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get the selected location and park type
  const selectedLocation = document.getElementById("location").value;
  const selectedParkType = document.getElementById("parkType").value;

  // Filter the national parks based on the selected criteria
  const filteredParks = nationalParksArray.filter((park) => {
    const matchesLocation = selectedLocation === "" || park.State === selectedLocation;
    const matchesParkType = selectedParkType === "" || park.LocationName.includes(selectedParkType);

    return matchesLocation && matchesParkType;
  });

  // Display the search results
  displaySearchResults(filteredParks);
}

// Function to display the search results
function displaySearchResults(results) {
  searchResults.innerHTML = "";

  if (results.length === 0) {
    searchResults.textContent = "No results found.";
  } else {
    // Create row and card containers
    var rowDiv;
    var cardContainer;

    for (var i = 0; i < results.length; i++) {
      // Create a new row and card container for every third card
      if (i % 3 === 0) {
        rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        searchResults.appendChild(rowDiv);
      }

      // Create a Bootstrap card element
      var card = document.createElement("div");
      card.className = "card mb-3 col-md-4";

      // Create the card header
      var cardHeader = document.createElement("div");
      cardHeader.className = "card-header d-flex justify-content-between align-items-center";

      // Set the card title
      var title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = results[i].LocationName;
      cardHeader.appendChild(title);

      // Append the card header to the card
      card.appendChild(cardHeader);

      // Create the card body
      var cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Set the address
      var address = document.createElement("p");
      address.className = "card-text";
      address.textContent = "Address: " + results[i].Address + ", " + results[i].City + ", " + results[i].State + ", " + results[i].ZipCode;
      cardBody.appendChild(address);

      // Set the phone
      var phone = document.createElement("p");
      phone.className = "card-text";
      phone.textContent = "Phone: " + results[i].Phone;
      cardBody.appendChild(phone);

      // Set the fax
      var fax = document.createElement("p");
      fax.className = "card-text";
      fax.textContent = "Fax: " + results[i].Fax;
      cardBody.appendChild(fax);

      // Append the card body to the card
      card.appendChild(cardBody);

      // Append the card to the current row
      rowDiv.appendChild(card);

      // Create a new row and card container for every third card
      if ((i + 1) % 3 === 0 || (i + 1) === results.length) {
        rowDiv = null;
        cardContainer = null;
      }
    }
  }
}





// Event listener for form submission
searchForm.addEventListener("submit", handleFormSubmit);

// Call the functions to populate the dropdowns initially
populateLocationDropdown();
populateParkTypeDropdown();

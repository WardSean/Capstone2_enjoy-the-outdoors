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
    for (const result of results) {
      const parkName = document.createElement("h3");
      parkName.textContent = result.LocationName;

      const address = document.createElement("p");
      address.textContent = `Address: ${result.Address}, ${result.City}, ${result.State}, ${result.ZipCode}`;

      const phone = document.createElement("p");
      phone.textContent = `Phone: ${result.Phone}`;

      const fax = document.createElement("p");
      fax.textContent = `Fax: ${result.Fax}`;

      searchResults.appendChild(parkName);
      searchResults.appendChild(address);
      searchResults.appendChild(phone);
      searchResults.appendChild(fax);
      searchResults.appendChild(document.createElement("hr"));
    }
  }
}

// Event listener for form submission
searchForm.addEventListener("submit", handleFormSubmit);

// Call the functions to populate the dropdowns initially
populateLocationDropdown();
populateParkTypeDropdown();

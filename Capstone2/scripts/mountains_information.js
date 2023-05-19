// Retrieve the mountain select dropdown element
const mountainSelect = document.getElementById("mountainSelect");

// Function to populate the dropdown menu with mountain options
function populateMountainDropdown() {
    console.log(mountainsArray);
    for (const mountain of mountainsArray) {
        const option = document.createElement("option");
        option.value = mountain.name;
        option.textContent = mountain.name;
        mountainSelect.appendChild(option);
    }
}

// Function to display mountain information based on the selected mountain
function displayMountainDetails() {
    const selectedMountain = mountainSelect.value;
    const mountainDetails = document.getElementById("mountainDetails");
  
    // Find the selected mountain in the mountainsArray
    const selectedMountainObj = mountainsArray.find(
      (mountain) => mountain.name === selectedMountain
    );
  
    // Display the mountain information
    mountainDetails.innerHTML = `
      <h2>${selectedMountainObj.name}</h2>
      <img src="${selectedMountainObj.img}" alt="${selectedMountainObj.name}">
      <p>Description: ${selectedMountainObj.desc}</p>
      <p>Elevation: ${selectedMountainObj.elevation}</p>
      <!-- Display any other relevant mountain information -->
    `;
  }

// Event listener for when the mountain select dropdown changes
mountainSelect.addEventListener("change", displayMountainDetails);

// Call the function to populate the mountain dropdown initially
populateMountainDropdown();

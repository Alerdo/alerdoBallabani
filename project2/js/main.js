// The performSearch function that will be executed when the search button is clicked or upon typing
function performSearch() {
    // Get the value of the search input
    let query = $('#searchInp').val().toLowerCase();
  
    // Check which tab is active and perform search accordingly
    if ($('#personnelBtn').hasClass('active')) {
        console.log("Searching personnel");
        searchTable(query, "#employeesTableBody");
    } else if ($('#departmentsBtn').hasClass('active')) {
        console.log("Searching departments");
        searchTable(query, "#departmentsTableBody");
    } else if ($('#locationsBtn').hasClass('active')) {
        console.log("Searching locations");
        searchTable(query, "#locationsTableBody");
    }
  }

// The searchTable function to perform the actual search in the table
function searchTable(query, tableBodySelector) {
  // Loop through all rows of the table body
  $(tableBodySelector + " tr").each(function() {
      $(this).show(); // Initially show every row
      
      // If the query is not empty and it's not found in the row, hide the row
      if (query && $(this).text().toLowerCase().indexOf(query) == -1) {
          $(this).hide();
      }
  });
}

// Event listener for the search button
$('#searchBtn').click(function() {
  console.log("Search button clicked"); // Debugging
  performSearch();
});

// Event to detect tab changes and update the search input's placeholder accordingly
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
  var target = $(e.target).attr("data-bs-target"); // activated tab

  if (target === '#personnel-tab-pane') {
      $('#searchInp').attr('placeholder', 'Search personnel...');
  } else if (target === '#departments-tab-pane') {
      $('#searchInp').attr('placeholder', 'Search departments...');
  } else if (target === '#locations-tab-pane') {
      $('#searchInp').attr('placeholder', 'Search locations...');
  }
});

// Trigger search when pressing 'Enter' on the keyboard
$("#searchInp").on("keyup", function (e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
      performSearch();
  }
});

let debounceTimeout;
$('#searchInp').on('input', function() {
  clearTimeout(debounceTimeout); // Clear any previously set timeout
  debounceTimeout = setTimeout(performSearch, 300); // Wait for 300ms before executing the search
});

// Event to detect tab changes and update the search input's placeholder accordingly
$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
  var target = $(e.target).attr("data-bs-target"); // activated tab

  if (target === '#personnel-tab-pane') {
      $('#searchInp').attr('placeholder', 'Search personnel...');
  } else if (target === '#departments-tab-pane') {
      $('#searchInp').attr('placeholder', 'Search departments...');
  } else if (target === '#locations-tab-pane') {
      $('#searchInp').attr('placeholder', 'Search locations...');
  }
});

//-----------------------REFRESH BUTTON------------------------------

  // Returns the active tab id
function getActiveTab() {
  if ($("#personnelBtn").hasClass("active")) {
      return "personnel";
  } else if ($("#departmentsBtn").hasClass("active")) {
      return "departments";
  } else if ($("#locationsBtn").hasClass("active")) {
      return "locations";
  }
}



$("#refreshBtn").click(function () {
  switch (getActiveTab()) {
      case "personnel":
          // Refresh personnel table
          console.log("Refreshing personnel table...");
          fetchDataAndPopulate();
          break;
      case "departments":
          // Refresh department table
          console.log("Refreshing department table...");
          fetchDepartmentsDataAndPopulate();
          break;
      case "locations":
          // Refresh location table
          console.log("Refreshing location table...");
          fetchAndPopulateLocations()
          break;
  }
});




//---------------------ADD+ BUTTON MODALE ------------------------------===

$("#addBtn").on("click", function () {
  let content = ""; // variable to store the dynamic content
  switch (getActiveTab()) {
    case "personnel":
    $("#modalLabel").text("Add Employee");

    content = `
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="addPersonnelFirstName" placeholder="First name" required>
        <label for="addPersonnelFirstName">First name</label>

        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="addPersonnelLastName" placeholder="Last name" required>
            <label for="addPersonnelLastName">Last name</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="addPersonnelJobTitle" placeholder="Department" required>
            <label for="addPersonnelJobTitle">Department</label>
        </div>
        <div class="form-floating mb-3">
            <input type="email" class="form-control" id="addPersonnelEmailAddress" placeholder="Email address" required>
            <label for="addPersonnelEmailAddress">Email Address</label>
        </div>
    `;

    $("#dynamicAddFields").html(content);



    $("#saveAddBtn").text("Create Employee");
    break;

    case "departments":
      $("#modalLabel").text("Add Department");

      content = `
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="addDepartmentName" placeholder="Department Name" required>
            <label for="addDepartmentName">Department Name</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="addDepartmentLocation" placeholder="Department Location" required>
            <label for="addDepartmentLocation">Department Location</label>
        </div>
      `;

      $("#saveAddBtn").text("Create Department");
      break;

    case "locations":
      $("#modalLabel").text("Add Location");
      content = `
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="addLocationName" placeholder="Location Name" required>
            <label for="addLocationName">Location Name</label>
        </div>
      `;
      $("#saveAddBtn").text("Create Location");
      break;
  }
  // Append the content to the modal body and show the modal
  $("#dynamicAddFields").html(content);
  $('#addModal').modal('show');
});








// On 'saveAddBtn' click, make an AJAX call based on the active tab
$("#saveAddBtn").on("click", function() {
    switch (getActiveTab()) {
        case "personnel":
            $.ajax({
                url: '/myProjects/project2/php/insertPersonnel.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    firstName: $("#addPersonnelFirstName").val(),
                    lastName: $("#addPersonnelLastName").val(),
                    departmentName: $("#addPersonnelJobTitle").val(),
                    email: $("#addPersonnelEmailAddress").val()
                },
                success: function(response) {

                    $('#addModal').modal('hide');
                    fetchDataAndPopulate();
                    const modalMessageElement = document.getElementById("modalMessage");
                
                    if (response.status.name === "failure") {
                        modalMessageElement.innerText = response.status.description;
                    } else if (response.status.name === "ok") {  // I noticed in your PHP it's "ok" not "success"
                        modalMessageElement.innerText = response.data.message;
                    }
                
                   
                
                    // Display the modal with the response message
                    const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
                    infoModal.show();
                },
                
            });
            break;

        case "departments":
            $.ajax({
                url: '/myProjects/project2/php/insertDepartment.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    name: $("#addDepartmentName").val(),
                    location: $("#addDepartmentLocation").val()
                },
                success: function(response) {
                    $('#addModal').modal('hide');
                    fetchDepartmentsDataAndPopulate();
                    const modalMessageElement = document.getElementById("modalMessage");
                    
                    if (response.status.code === "404" && response.status.name === "not found") {
                        modalMessageElement.innerText = response.status.description;
                    } else if (response.status.code === "400" && response.status.name === "executed") {
                        modalMessageElement.innerText = response.status.description;
                    } else if (response.status.code === "200" && response.status.name === "ok") {
                        modalMessageElement.innerText = response.data.message;
                    }
                    
                    // Display the modal with the response message
                    const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
                    infoModal.show();
                },
                
                
            });
            break;

        case "locations":
            $.ajax({
                url: '/myProjects/project2/php/insertLocation.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    locationName: $("#addLocationName").val()
                },
                success: function(response) {
                    fetchAndPopulateLocations();
                    $('#addModal').modal('hide');
                    const modalMessageElement = document.getElementById("modalMessage");
                                
                    if (response.status.name === "failure") {
                        modalMessageElement.innerText = response.status.description;
                    } else if (response.status.name === "conflict") {
                        modalMessageElement.innerText = response.status.description;
                    } else if (response.status.name === "ok") {
                        modalMessageElement.innerText = response.data.message;
                    }
                
                    // Display the modal with the response message
                    const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
                    infoModal.show();
                }
                
                
            });
            break;
    }
});


//---------------UPDATE OR EDIT BUTTON MODALE DISPLAY LOGIC----------------------------------

$("#editData").on("show.bs.modal", function (e) {
  const entityId = $(e.relatedTarget).attr("data-id");
  const context = $(e.relatedTarget).attr("data-context");

  switch(context) {
      case "employee":
          const employee = employeesData.find(emp => emp.id == entityId);  // <-- Reference employeesData
          console.log(employee);
          if (employee) {
              $("#modalTitle").text("Edit Employee");
              $("#editPersonnelEntityID").val(employee.id);

              const content = `
                  <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="editPersonnelFirstName" placeholder="First name" required value="${employee.firstName}">
                      <label for="editPersonnelFirstName">First name</label>
                  </div>
                  <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="editPersonnelLastName" placeholder="Last name" required value="${employee.lastName}">
                      <label for="editPersonnelLastName">Last name</label>
                  </div>
                  <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="editPersonnelJobTitle" placeholder="Department" required value="${employee.departmentName}">
                      <label for="editPersonnelJobTitle">Department</label>
                  </div>
            
                  <div class="form-floating mb-3">
                      <input type="email" class="form-control" id="editPersonnelEmailAddress" placeholder="Email address" required value="${employee.email}">
                      <label for="editPersonnelEmailAddress">Email Address</label>
                  </div>
                  <input type="hidden" id="editEntityID" value="${employee.id}">
                  
                 
              `;

              $("#dynamicModalFields").html(content);

          } else {
              $("#modalTitle").text("Employee not found");
          }
          break;

          case "department":
            const department = departmentsData.find(dep => dep.id == entityId);
            // console.log(department);
            if (department) {
                $("#modalTitle").text("Edit Department");
        
                $("#editPersonnelEntityID").val(department.id);
        
                const content = `
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="editDepartmentName" placeholder="Department Name" required value="${department.departmentName}">
                        <label for="editDepartmentName">Department Name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="editDepartmentLocation" placeholder="Location" required value="${department.departmentLocation}">
                        <label for="editDepartmentLocation">Location</label>
                    </div>
                    <input type="hidden" id="editEntityID" value="${department.id}">
                `;
        
                $("#dynamicModalFields").html(content);
            } else {
                $("#modalTitle").text("Department not found");
            }
            break;

            case "location":
              const location = locationData.find(loc => loc.id == entityId);
              
              if (location) {
                  $("#modalTitle").text("Edit Location");
          
                  $("#editPersonnelEntityID").val(location.id);
          
                  const content = `
                      <div class="form-floating mb-3">
                          <input type="text" class="form-control" id="editLocationName" placeholder="Location Name" required value="${location.name}">
                          <label for="editLocationName">Location Name</label>
                      </div>
                      <input type="hidden" id="editEntityID" value="${location.id}">
                  `;
          
                  $("#dynamicModalFields").html(content);
              } else {
                  $("#modalTitle").text("Location not found");
              }
              break;
          
  }
});

$(document).ready(function() {
  $("#updateData").click(function() {
      switch (getActiveTab()) {
          case "personnel":
              updatePersonnel()
                  .then(() => {
                      $('#editData').modal('hide');
                      fetchDataAndPopulate(); 
                      console.log("Personnel data updated and new data rendered.");
                  })
                  .catch((error) => {
                      console.error('Error after updating personnel:', error);
                  });
              break;

          case "departments":
              updateDepartment() //I made this function return a promise so the fetchDataAndPopulate will run only if the promise is resolved
                  .then(() => {
                      $('#editData').modal('hide');
                      fetchDepartmentsDataAndPopulate();  // Assuming you want to re-fetch data for departments as well
                      console.log("Department data updated and new data rendered.");
                  })
                  .catch((error) => {
                      console.error('Error after updating department:', error);
                  });
              break;
              
          case "locations":
              updateLocation()
                  .then(() => {
                      $('#editData').modal('hide');
                      fetchAndPopulateLocations();  // Assuming you want to re-fetch data for locations as well
                      console.log("Location data updated and new data rendered.");
                  })
                  .catch((error) => {
                      console.error('Error after updating location:', error);
                  });
              break;
     
      }
  });
});


function updatePersonnel() {
  return new Promise((resolve, reject) => {
      // ... [your previous code here]
      // Getting values from the input fields
  const personnelID = $('#editEntityID').val();
  const firstName = $("#editPersonnelFirstName").val();
  const lastName = $("#editPersonnelLastName").val();
  const departmentName = $("#editPersonnelJobTitle").val();
  // const locationName = $("#editPersonnelLocation").val();
  const email = $("#editPersonnelEmailAddress").val();

  // Constructing the data object
  const dataToSend = {
      id: personnelID,
      firstName: firstName,
      lastName: lastName,
      departmentName: departmentName,
      // locationName: locationName,
      email: email
  };
console.log(dataToSend.id)
      // AJAX Call
      $.ajax({
          url: '/myProjects/project2/php/updatePersonnelInfo.php', 
          type: 'PUT',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(dataToSend),
          success: function(response) {
              if(response.error) {
                  document.getElementById("modalMessage").innerText = response.error;
              } else {
                  document.getElementById("modalMessage").innerText = response.success;
              }
              const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
              infoModal.show();

              // Resolve the promise on success
              resolve(response);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.error('Error updating data:', textStatus, errorThrown, jqXHR);
              document.getElementById("modalMessage").innerText = "An unexpected error occurred.";
              var myModal = new bootstrap.Modal(document.getElementById('responseModal'));
              myModal.show();

              // Reject the promise on error
              reject(new Error(textStatus));
          }
      });
  });
}



function updateDepartment() {
  return new Promise((resolve, reject) => {
      const departmentID = $('#editEntityID').val();
      const departmentName = $('#editDepartmentName').val();
      const departmentLocation = $('#editDepartmentLocation').val();

      const dataToSend = {
          id: departmentID,
          departmentName: departmentName,
          locationName: departmentLocation
      };
      console.log(dataToSend.id);

      $.ajax({
          url: "/myProjects/project2/php/updateDepartments.php",
          type: 'POST',
          data: JSON.stringify(dataToSend),
          contentType: 'application/json',
          success: function(response) {
              if(response.error) {
                  document.getElementById("modalMessage").innerText = response.error;
              } else {
                  document.getElementById("modalMessage").innerText = response.success;
              }
              const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
              infoModal.show();


              resolve(response); // Resolve the promise on success
          },
          error: function(jqXHR, textStatus) {
              alert('Failed to update. Please try again.');
              reject(new Error(textStatus)); // Reject the promise on error
          }
      });
  });
}


function updateLocation() {
  return new Promise((resolve, reject) => {
      const locationID = $('#editEntityID').val();
      const locationName = $('#editLocationName').val();

      const dataToSend = {
          id: locationID,
          name: locationName
      };
      console.log(dataToSend.id);

      $.ajax({
          url: "/myProjects/project2/php/updateLocations.php",
          type: 'POST',
          data: JSON.stringify(dataToSend),
          contentType: 'application/json',
          success: function(response) {
              if(response.error) {
                  document.getElementById("modalMessage").innerText = response.error;
              } else {
                  document.getElementById("modalMessage").innerText = response.success;
              }
              const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
              infoModal.show();

              resolve(response); // Resolve the promise on success
          },
          error: function(jqXHR, textStatus) {
              alert('Failed to update. Please try again.');
              reject(new Error(textStatus)); // Reject the promise on error
          }
      });
  });
}

// FILTER DATA BUTTON 


function updateFilterOptions() {
  // Define what options should be available for each case
  const options = {
    personnel: ['Name', 'Department', 'Location', 'Email'],
    departments: ['Department', 'Location'],
    locations: ['Location']
  };

  // Get the current active tab
  const activeTab = getActiveTab(); // This function should return "personnel", "departments", or "locations" based on the active tab

  // Get the relevant options for the active tab
  const relevantOptions = options[activeTab];

  // Construct the new dropdown items
  let newDropdownItems = '';
  for (let option of relevantOptions) {
    newDropdownItems += `<li><a class="dropdown-item" href="#" data-filter="${option.toLowerCase()}">${option}</a></li>`;
  }

  // Update the dropdown with the new items
  $('#filterOptions').html(newDropdownItems);
}

// Call updateFilterOptions when the filter button is clicked


$("#filterBtn").click(function () {
  // Toggle the dropdown visibility
  $("#filterOptions").toggle();
  
  // Update the dropdown content based on active tab
  updateFilterOptions();
});

// If someone clicks outside of the dropdown, it should close
$(document).click(function(event) {
  if (!$(event.target).closest('#filterBtn').length && !$(event.target).closest('#filterOptions').length) {
      $("#filterOptions").hide();
  }
});

//SOULUTION FOR FILTER DATA

// This will handle the event when a dropdown item is clicked
$("#filterOptions").on("click", ".dropdown-item", function () {
  const filterType = $(this).data("filter");
  switch (getActiveTab()) {
      case "personnel":
          fetchDataAndPopulate(mapFilterOptionToParameter("personnel", filterType));
          break;
      case "departments":
          fetchDepartmentsDataAndPopulate(mapFilterOptionToParameter("departments", filterType));
          break;
      case "locations":
          fetchAndPopulateLocations(mapFilterOptionToParameter("locations", filterType));
          break;
  }

  // Close the dropdown after filtering
  $("#filterOptions").hide();
});


function mapFilterOptionToParameter(activeTab, filterType) {
  const filterMap = {
      personnel: {
          name: "firstName",       // Assuming that 'Name' refers to the first name for simplicity. Adjust if necessary.
          department: "departmentName",
          location: "locationName",
          email: "email"
      },
      departments: {
          department: "departmentName",
          location: "departmentLocation"
      },
      locations: {
          location: "locations"
      }
  };

  return filterMap[activeTab][filterType];
}


// $("#filterBtn").click(function () {
//   switch (getActiveTab()) {
//       case "personnel":
//           // Filter personnel table
//           console.log("Filtering personnel table...");
//           break;
//       case "departments":
//           // Filter department table
//           console.log("Filtering department table...");
//           break;
//       case "locations":
//           // Filter location table
//           console.log("Filtering location table...");
//           break;
//   }
// });










// ---------------Start Of My Code---------------------------



// ---------------Populate PERSONNEL---------------------------
let employeesData = [];


async function fetchData() {
  try {
      const response = await $.ajax({
          url: "/myProjects/project2/php/getAllPersonnel.php",
          type: 'GET',
          dataType: 'text'
      });
      
      const cleanedData = response.replace("Connected successfully", "").trim();
      employeesData = JSON.parse(cleanedData);
      return employeesData
      
  } catch (error) {
      throw new Error("Error fetching employees data: " + error);
  }
}


const $originalTemplate = $(".employeeTemplate");

function populateEmployeesTable(data, sortColumn) {
  // console.log("Data received for populating:", data);
  const sortedData = data.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return -1;
      if (a[sortColumn] > b[sortColumn]) return 1;
      return 0;
  });

  const $tableBody = $("#employeesTableBody");
  const $template = $originalTemplate.clone().removeClass("employeeTemplate").show();
  $tableBody.empty();

  if(sortedData) {
    sortedData.forEach(employee => {
      const $row = $template.clone();

      $row.find(".employeeName").text(employee.firstName + ' ' + employee.lastName);
      $row.find(".employeeDepartment").text(employee.departmentName);
      $row.find(".employeeLocation").text(employee.locationName);
      $row.find(".employeeEmail").text(employee.email);
      
      // Assigning the employee ID to the data-id attribute for both buttons
      $row.find(".editEmployeeBtn, .deletePersonnelBtn").attr("data-id", employee.id);

      $tableBody.append($row);
  });
  }
}

async function fetchDataAndPopulate(sortColumn = "firstName") {
  try {
      const data = await fetchData();
      populateEmployeesTable(data, sortColumn);
  } catch (error) {
      console.error("Failed to fetch or parse data:", error);
  }
}
// Usage examples:
fetchDataAndPopulate();               // Default: sorts by firstName
// fetchDataAndPopulate("departmentName"); // Sorts by department
// fetchDataAndPopulate("locationName");   // Sorts by location
// fetchDataAndPopulate("email");          // Sorts by email





// ------------------------POPULATE DEPARTMENTS SECTION -----------------------------------



let departmentsData = [];
const $departmentTemplate = $(".departmentTemplate");

async function fetchDepartmentsData() {
    try {
        const response = await $.ajax({
            url: "/myProjects/project2/php/getAllDepartments.php",
            type: 'GET',
            dataType: 'text'
        });

        const cleanedData = response.replace("Connected successfully", "").trim();
        departmentsData = JSON.parse(cleanedData);
        
        return departmentsData;

    } catch (error) {
        throw new Error("Error fetching departments data: " + error);
    }
}


function populateDepartmentsTable(data, sortColumn = "departmentName") {
  const sortedData = data.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return -1;
      if (a[sortColumn] > b[sortColumn]) return 1;
      return 0;
  });

  const $tableBody = $("#departmentsTableBody");
  const $template = $departmentTemplate.clone().removeClass("departmentTemplate").show();
  $tableBody.empty();

  if (sortedData) {
      sortedData.forEach(department => {
          const $row = $template.clone();

          $row.find(".departmentName").text(department.departmentName);
          $row.find(".departmentLocation").text(department.departmentLocation);
          $row.find(".editDepartmentBtn, .deleteDepartmentBtn").attr("data-id", department.id);

          $tableBody.append($row);
      });
  }
}

async function fetchDepartmentsDataAndPopulate(sortColumn) {
    try {
        const data = await fetchDepartmentsData();
        populateDepartmentsTable(data,sortColumn);
    } catch (error) {
        console.error("Failed to fetch or parse department data:", error);
    }
}

// Usage
fetchDepartmentsDataAndPopulate(); //default is departmentName, use departmentLocation for filter  





// --------------------------POPULATE LOCATION SECTION ---------------------------

let locationData = [];
const $locationTemplate = $(".locationTemplate");


async function fetchLocationData() {
    try {
        const response = await $.ajax({
            url: "/myProjects/project2/php/getAllLocations.php",
            type: 'GET',
            dataType: 'text'
        });

        const cleanedData = response.replace("Connected successfully", "").trim();
        locationData = JSON.parse(cleanedData);
        return locationData;

    } catch (error) {
        throw new Error("Error fetching location data: " + error);
    }
}

function populateLocationsTable(data, sortColumn = null) {
  if (sortColumn === "locations") {
      data.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
      });
  }

  const $tableBody = $("#locationsTableBody");
  const $template = $locationTemplate.clone().removeClass("locationTemplate").show();
  $tableBody.empty();

  if (data) {
      data.forEach(location => {
          const $row = $template.clone();

          $row.find(".locationName").text(location.name);
          $row.find(".editLocationBtn, .deleteLocationBtn").attr("data-id", location.id);

          $tableBody.append($row);
      });
  }
}

async function fetchAndPopulateLocations(sortColumn) {
  try {
      const data = await fetchLocationData();
      populateLocationsTable(data, sortColumn);
  } catch (error) {
      console.error("Failed to fetch or parse location data:", error);
  }
}

// Usage
fetchAndPopulateLocations(); // Sorts by locations alphabetically. // use "use location as parameter when you need to sort the data"




// ------------------------DELETE MODALE-----------------------------------
// Utility functions
function deletePersonnelById(id) {
    // Call your API to delete the personnel by ID
    // Here's a basic AJAX example:
    $.ajax({
        url: `/myProjects/project2/php/deletePersonnel.php?id=${id}`,
        type: 'DELETE',
        success: function(response) {
            // Check the response status code
            if (response.status && response.status.code == "200") {
                // Refresh the data after successful deletion
                fetchDataAndPopulate();
                console.log("Successfully deleted personnel:", response.data.firstName, response.data.lastName);
                document.getElementById("modalMessage").innerText = "Successfully deleted personnel: " + response.data.firstName + " " + response.data.lastName;
            } else {
                // Handle any other status codes or failure messages
                console.error("Failed to delete personnel due to:", response.status.description);
                document.getElementById("modalMessage").innerText = response.status.description;
            }
            
            // Display the modal with the response message
            const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
            infoModal.show();
        },        
        error: function(error) {
            console.error("Failed to delete personnel:", error);
        }
    });
}

function deleteDepartmentById(id) {
    $.ajax({
        url: `/myProjects/project2/php/deleteDepartment.php?id=${id}`,
        type: 'DELETE',
        success: function(response) {
            if (response.status.name === "failure") {
                document.getElementById("modalMessage").innerText = response.status.description;
            } else if (response.status.name === "success") {
                document.getElementById("modalMessage").innerText = "Successfully deleted: " + response.data.departmentName; // or locationName if you're working with locations
            }
            fetchDepartmentsDataAndPopulate();
            // Display the modal with the response message
            const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
            infoModal.show();
        },
        error: function(error) {
            console.error("Failed to delete department:", error);
        }
    });
}

function deleteLocationById(id) {
    $.ajax({
        url: `/myProjects/project2/php/deleteLocation.php?id=${id}`,
        type: 'DELETE',
        success: function(response) {
            if (response.status.name === "failure") {
                document.getElementById("modalMessage").innerText = response.status.description;
            } else if (response.status.name === "success") {
                document.getElementById("modalMessage").innerText = "Successfully deleted: " + response.data.locationName; // or locationName if you're working with locations
            }
            fetchAndPopulateLocations();
            // Display the modal with the response message
            const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
            infoModal.show();
        },
        
        error: function(error) {
            console.error("Failed to delete location:", error);
        }
    });
}

// Event Listeners for Delete Buttons
$(document).on("click", ".deletePersonnelBtn", function() {
    const itemId = $(this).attr("data-id");
    const item = employeesData.find(emp => emp.id == itemId);
    if (item) {
        $("#itemNameToDelete").text(item.firstName + ' ' + item.lastName);
        $("#deleteConfirmationModal").modal("show");
        $(".confirmDelete").data('type', 'personnel').data('id', itemId);
    }
});

$(document).on("click", ".deleteDepartmentBtn", function() {
    const itemId = $(this).attr("data-id");
    const item = departmentsData.find(dept => dept.id == itemId);
    if (item) {
        $("#itemNameToDelete").text(item.departmentName);
        $("#deleteConfirmationModal").modal("show");
        $(".confirmDelete").data('type', 'department').data('id', itemId);
    }
});

$(document).on("click", ".deleteLocationBtn", function() {
    const itemId = $(this).attr("data-id");
    const item = locationData.find(loc => loc.id == itemId);
    if (item) {
        $("#itemNameToDelete").text(item.name);
        $("#deleteConfirmationModal").modal("show");
        $(".confirmDelete").data('type', 'location').data('id', itemId);
    }
});

// Delete Confirmation Logic
$(document).on("click", ".confirmDelete", function() {
    const itemType = $(this).data('type');
    const itemId = $(this).data('id');
    switch(itemType) {
        case 'personnel':
            deletePersonnelById(itemId);
            break;
        case 'department':
            deleteDepartmentById(itemId);
            break;
        case 'location':
            deleteLocationById(itemId);
            break;
    }
    $("#deleteConfirmationModal").modal("hide");
});

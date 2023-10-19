// The performSearch function that will be executed when the search button is clicked
function performSearch() {
  // Get the value of the search input
  let query = $('#searchInp').val().toLowerCase();

  // Check which tab is active
  if ($('#personnelBtn').hasClass('active')) {
      // Perform the search for the personnel table
      console.log("Searching personnel");
      searchTable(query, "#employeesTableBody");
  }
  else if ($('#departmentsBtn').hasClass('active')) {
      // Perform the search for the department table
      console.log("Searching departments");
      searchTable(query, "#departmentsTableBody");
  }
  else if ($('#locationsBtn').hasClass('active')) {
      // Perform the search for the location table
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
          break;
      case "departments":
          // Refresh department table
          console.log("Refreshing department table...");
          break;
      case "locations":
          // Refresh location table
          console.log("Refreshing location table...");
          break;
  }
});



 // ADD DATA LOGIC FOR EACH SECTION

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
            <input type="text" class="form-control" id="addPersonnelJobTitle" placeholder="Job title" required>
            <label for="addPersonnelJobTitle">Job Title</label>
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




      //UPDATE DATA LOGIC FOR EACH SECTION 

$("#editData").on("show.bs.modal", function (e) {
  const entityId = $(e.relatedTarget).attr("data-id");
  const context = $(e.relatedTarget).attr("data-context");

  switch(context) {
      case "employee":
          const employee = apiResponse.find(emp => emp.id == entityId);
          console.log(employee)
          if (employee) {
            
              $("#modalTitle").text("Edit Employee");
              $("#editPersonnelEntityID").val(employee.id);

              const nameParts = employee.name.split(' '); 
              const firstName = nameParts[0];
              const lastName = nameParts.slice(1).join(' ');

              const content = `
                  <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="editPersonnelFirstName" placeholder="First name" required value="${firstName}">
                      <label for="editPersonnelFirstName">First name</label>
                  </div>
                  <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="editPersonnelLastName" placeholder="Last name" required value="${lastName}">
                      <label for="editPersonnelLastName">Last name</label>
                  </div>
                  <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="editPersonnelJobTitle" placeholder="Job title" required value="${employee.role}">
                      <label for="editPersonnelJobTitle">Job Title</label>
                  </div>
                  <div class="form-floating mb-3">
                      <input type="email" class="form-control" id="editPersonnelEmailAddress" placeholder="Email address" required value="${employee.email}">
                      <label for="editPersonnelEmailAddress">Email Address</label>
                  </div>
              `;

              $("#dynamicModalFields").html(content);

          } else {
              $("#modalTitle").text("Employee not found");
          }
          break;

          case "department":
            const department = departmentsApiResponse.find(dep => dep.id == entityId);
            console.log(department);
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
                `;
        
                $("#dynamicModalFields").html(content);
            } else {
                $("#modalTitle").text("Department not found");
            }
            break;

            case "location":
              const location = locationsApiResponse.find(loc => loc.id == entityId);
              console.log(location);
              if (location) {
                  $("#modalTitle").text("Edit Location");
          
                  $("#editPersonnelEntityID").val(location.id);
          
                  const content = `
                      <div class="form-floating mb-3">
                          <input type="text" class="form-control" id="editLocationName" placeholder="Location Name" required value="${location.locationName}">
                          <label for="editLocationName">Location Name</label>
                      </div>
                  `;
          
                  $("#dynamicModalFields").html(content);
              } else {
                  $("#modalTitle").text("Location not found");
              }
              break;
          
  }
});

// $(document).on('click', '#updateData', function() {
//   const editFirstName = $("#editPersonnelFirstName").val();
//   const editLastName = $("#editPersonnelLastName").val();
//   const editJobTitle = $("#editPersonnelJobTitle").val();
//   const editEmail = $("#editPersonnelEmailAddress").val();
  

//   console.log(editFirstName, editLastName, editJobTitle, editEmail, "hello its working");
// });


// $(document).on('click', '#saveAddBtn', function() {
//   const eeditFirstName = $("#addPersonnelFirstName").val();
//   const eeditLastName = $("#addPersonnelLastName").val();
//   const eeditJobTitle = $("#addPersonnelJobTitle").val();
//   const eeditEmail = $("#addPersonnelEmailAddress").val();
  

//   console.log(eeditFirstName, eeditLastName, eeditJobTitle, eeditEmail, "hello its working");
// });






// FILTER DATA BUTTON 



$("#filterBtn").click(function () {
  switch (getActiveTab()) {
      case "personnel":
          // Filter personnel table
          console.log("Filtering personnel table...");
          break;
      case "departments":
          // Filter department table
          console.log("Filtering department table...");
          break;
      case "locations":
          // Filter location table
          console.log("Filtering location table...");
          break;
  }
});

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






// You may also want to call updateFilterOptions when the tab changes
// Here, you should tie into your tab change event, however you handle it.
// For example:
// $('your-tab-selector').on('tab-change-event', updateFilterOptions);
















$("#personnelBtn").click(function () {
  // Optionally, call function to refresh personnel table when the tab is clicked
  console.log("Refreshing personnel table...");
});

$("#departmentsBtn").click(function () {
  // Optionally, call function to refresh department table when the tab is clicked
  console.log("Refreshing department table...");
});

$("#locationsBtn").click(function () {
  // Optionally, call function to refresh location table when the tab is clicked
  console.log("Refreshing location table...");
});


 


  

  



// ---------------Start Of My Code---------------------------



// Sample API response
const apiResponse = [
  {
      id: 23,
      name: "Random Tamarra",
      role: "Support",
      location: "Munich",
      email: "tacem@vinaora.com"
  }
  // ... other employees
];

function populateEmployeesTable(response) {
  const $tableBody = $("#employeesTableBody");
  const $template = $(".employeeTemplate").clone().removeClass("employeeTemplate").show();

  // Empty the table body
  $tableBody.empty();

  response.forEach(employee => {
      const $row = $template.clone();

      $row.find(".employeeName").text(employee.name);
      $row.find(".employeeRole").text(employee.role);
      $row.find(".employeeLocation").text(employee.location);
      $row.find(".employeeEmail").text(employee.email);
      $row.find(".editEmployeeBtn, .deletePersonnelBtn").attr("data-id", employee.id);

      $tableBody.append($row);
  });
}

// Call the function to populate the table when you receive the API response
populateEmployeesTable(apiResponse);







// ------------------------POPULATE DEPARTMENTS SECTION -----------------------------------

const departmentsApiResponse = [
  {
      id: 1,
      departmentName: "Human resources",
      departmentLocation: "London"
  },
  {
    id: 2,
    departmentName: "IT",
    departmentLocation: "London"
}
];


function populateDepartmentsTable(response) {
  const $tableBody = $("#departmentsTableBody");
  const $template = $(".departmentTemplate").clone().removeClass("departmentTemplate").show();

  // Empty the table body
  $tableBody.empty();

  response.forEach(department => {
      const $row = $template.clone();

      $row.find(".departmentName").text(department.departmentName);
      $row.find(".departmentLocation").text(department.departmentLocation);
      $row.find(".editDepartmentBtn, .deleteDepartmentBtn").attr("data-id", department.id);

      $tableBody.append($row);
  });
}

// Call the function to populate the departments table when you receive the API response
populateDepartmentsTable(departmentsApiResponse);





// --------------------------POPULATE LOCATION SECTION ---------------------------
const locationsApiResponse = [
  {
      id: 1,
      locationName: "London"
  },
  {
      id: 2,
      locationName: "Paris"
  }
  // ... other locations
];


function populateLocationsTable(response) {
  const $tableBody = $("#locationsTableBody");
  const $template = $(".locationTemplate").clone().removeClass("locationTemplate").show();

  // Empty the table body
  $tableBody.empty();

  response.forEach(location => {
      const $row = $template.clone();

      $row.find(".locationName").text(location.locationName);
      $row.find(".editLocationBtn, .deleteLocationBtn").attr("data-id", location.id);

      $tableBody.append($row);
  });
}

// Call the function to populate the locations table when you receive the API response
populateLocationsTable(locationsApiResponse);




// ------------------------DELETE MODALE-----------------------------------



$(document).on("click", ".deletePersonnelBtn", function() {
  const itemId = $(this).attr("data-id");
  const item = apiResponse.find(emp => emp.id == itemId);

  if (item) {
      $("#itemNameToDelete").text(item.name);
      $("#deleteConfirmationModal").modal("show");
  }
});


$(document).on("click", ".deleteDepartmentBtn", function() {
  const itemId = $(this).attr("data-id");
  const item = departmentsApiResponse.find(dept => dept.id == itemId);

  if (item) {
      $("#itemNameToDelete").text(item.departmentName); // Assuming you have a departmentName property
      $("#deleteConfirmationModal").modal("show");
  }
});

// Event listener for the Location Delete button
$(document).on("click", ".deleteLocationBtn", function() {
  const itemId = $(this).attr("data-id");
  const item = locationsApiResponse.find(loc => loc.id == itemId);

  if (item) {
      $("#itemNameToDelete").text(item.locationName);
      $("#deleteConfirmationModal").modal("show");
  }
});

// Add logic for the delete action on clicking the "Yes, Delete" button.
$(document).on("click", ".confirmDelete", function() {
  // Here, depending on the context, delete the right item
  // You can differentiate the context by checking the current text in `itemNameToDelete`
  // Or you can set a global state/data attribute indicating the current type - Personnel, Department, or Location
  $("#deleteConfirmationModal").modal("hide");
});










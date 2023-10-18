$("#searchInp").on("keyup", function () {
  
    // your code
    
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

$("#addBtn").click(function () {
  switch (getActiveTab()) {
      case "personnel":
          // Open add modal for personnel
          console.log("Opening add modal for personnel...");
          break;
      case "departments":
          // Open add modal for departments
          console.log("Opening add modal for departments...");
          break;
      case "locations":
          // Open add modal for locations
          console.log("Opening add modal for locations...");
          break;
  }
});

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


  // $("#refreshBtn").click(function () {
    
  //   if ($("#personnelBtn").hasClass("active")) {
      
  //     // Refresh personnel table
      
  //   } else {
      
  //     if ($("#departmentsBtn").hasClass("active")) {
        
  //       // Refresh department table
        
  //     } else {
        
  //       // Refresh location table
        
  //     }
      
  //   }
    
  // });
  
  // $("#filterBtn").click(function () {
    
  //   // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  // });
  
  // $("#addBtn").click(function () {
    
  //   // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  // });
  
  // $("#personnelBtn").click(function () {
    
  //   // Call function to refresh presonnel table
    
  // });
  
  // $("#departmentsBtn").click(function () {
    
  //   // Call function to refresh department table
    
  // });
  
  // $("#locationsBtn").click(function () {
    
  //   // Call function to refresh location table
    
  // });
  


  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    const employeeId = $(e.relatedTarget).attr("data-id");
    const employee = apiResponse.find(emp => emp.id == employeeId);
  
    if (employee) {
      $("#editPersonnelEmployeeID").val(employee.id);

      const nameParts = employee.name.split(' '); // Splitting by space
      $("#editPersonnelFirstName").val(nameParts[0]); // First part is the first name
      $("#editPersonnelLastName").val(nameParts.slice(1).join(' ')); // Rest of the parts are last name

      $("#editPersonnelJobTitle").val(employee.role);
      $("#editPersonnelEmailAddress").val(employee.email);
  
      // When you're ready to populate the department dropdown, you can do it here
  
    } else {
      $("#editPersonnelModal .modal-title").replaceWith("Employee not found");
    }
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


// Event listener for the Personnel Delete button
$(document).on("click", ".deletePersonnelBtn", function() {
  const itemId = $(this).attr("data-id");
  const item = apiResponse.find(emp => emp.id == itemId);

  if (item) {
      $("#itemNameToDelete").text(item.name);
      $("#deleteConfirmationModal").modal("show");
  }
});

// Event listener for the Department Delete button
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

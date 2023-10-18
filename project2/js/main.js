$("#searchInp").on("keyup", function () {
  
    // your code
    
  });
  


  $("#refreshBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        
      } else {
        
        // Refresh location table
        
      }
      
    }
    
  });
  
  $("#filterBtn").click(function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").click(function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });
  
  $("#personnelBtn").click(function () {
    
    // Call function to refresh presonnel table
    
  });
  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    
  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    
  });
  


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
  },
  {
    id: 24,
    name: "Anna  Tamarra",
    role: "Support",
    location: "Munich",
    email: "tacem@vinaora.com"
},
{
  id: 25,
  name: "Jake Tamarra",
  role: "Support",
  location: "Munich",
  email: "tacem@vinaora.com"
},
{
  id: 26,
  name: "John Tamarra",
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




// ------------------------DELETE MODALE-----------------------------------


$(document).on("click", ".deletePersonnelBtn", function() {
  const employeeId = $(this).attr("data-id");
  const employee = apiResponse.find(emp => emp.id == employeeId);

  if (employee) {
      $("#employeeNameToDelete").text(employee.name);
      $("#deleteConfirmationModal").modal("show");
  }
});

// Add logic for the delete action on clicking the "Yes, Delete" button.
$(document).on("click", ".confirmDelete", function() {
  // Here, you can add the logic to delete the employee from the database or the backend.
  // After successful deletion, you can refresh the employee table or remove the specific row.
  $("#deleteConfirmationModal").modal("hide");
});

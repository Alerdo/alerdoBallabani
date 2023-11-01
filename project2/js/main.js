


// Event listener for the search button
$('#searchBtn').on("keyup", function (){

    performSearch();

  });



function performSearch() {

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


let debounceTimeout;
$('#searchInp').on('input', function() {
  clearTimeout(debounceTimeout); // Clear any previously set timeout
  debounceTimeout = setTimeout(performSearch, 300); // Wait for 300ms before executing the search
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





//Add 
//---------------UPDATE OR EDIT BUTTON MODALE DISPLAY LOGIC----------------------------------

$(document).ready(function() {
    // Event handler for submitting the personnel form
    $("#editPersonnelModal").on("submit", function(e) {

        $('#editPersonnelModal').modal('hide');
        e.preventDefault(); // Prevents the form from submitting the traditional way
        
        updatePersonnel()
            .then(() => {

                fetchDataAndPopulate();
                console.log("Personnel data updated and new data rendered.");
            })
            .catch((error) => {
                console.error('Error after updating personnel:', error);
            });
    });

    // Event handler for submitting the departments form
    $("#editDepartmentModal").on("submit", function(e) {

        $('#editDepartmentModal').modal('hide');
        e.preventDefault(); // Prevents the form from submitting the traditional way
        updateDepartment()
            .then(() => {
                fetchDepartmentsDataAndPopulate();
                console.log("Department data updated and new data rendered.");
            })
            .catch((error) => {
                console.error('Error after updating department:', error);
            });
    });

    // Event handler for submitting the locations form
    $("#editLocationModal").on("submit", function(e) {

        $('#editLocationModal').modal('hide');
        e.preventDefault(); // Prevents the form from submitting the traditional way
        updateLocation()
            .then(() => {
                fetchAndPopulateLocations();
                console.log("Location data updated and new data rendered.");
            })
            .catch((error) => {
                console.error('Error after updating location:', error);
            });
    });
});




function updatePersonnel() {
  return new Promise((resolve, reject) => {
    
  const personnelID = $('#editPersonnelEmployeeID').val();
  const firstName = $("#editPersonnelFirstName").val();
  const lastName = $("#editPersonnelLastName").val();
  const departmentName = $("#editPersonnelDepartment").val();
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
// console.log(dataToSend)
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
                document.getElementById("modalMessage").innerHTML = '<b>' + response.name + ' ' + response.lastname+"'s" + '</b> information was updated successfully.';
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
      const departmentID = $('#editDepartmentID').val();
      const departmentName = $('#editDepartmentName').val();
      const departmentLocation = $('#editDepartmentLocationDropdown').val();

      const dataToSend = {
          id: departmentID,
          departmentName: departmentName,
          locationName: departmentLocation
      };
      console.log(dataToSend)

      $.ajax({
          url: "/myProjects/project2/php/updateDepartments.php",
          type: 'POST',
          data: JSON.stringify(dataToSend),
          contentType: 'application/json',
          success: function(response) {
            if(response.error) {
                document.getElementById("modalMessage").innerText = response.error;
            } else {
                const oldName = response.oldName;
                const newName = response.newName;
                document.getElementById("modalMessage").innerHTML = `Succesfully updated department <b>${oldName}</b>`; // was successfully changed into <b>${newName}</b>
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
      const locationID = $('#editLocationID').val();
      const locationName = $('#editLocationName').val();

      const dataToSend = {
          id: locationID,
          name: locationName
      };
      console.log(dataToSend)

      $.ajax({
          url: "/myProjects/project2/php/updateLocations.php",
          type: 'POST',
          data: JSON.stringify(dataToSend),
          contentType: 'application/json',
          success: function(response) {
            if (response.error) {
                document.getElementById("modalMessage").innerText = response.error;
            } else {
                document.getElementById("modalMessage").innerHTML = 'Successfully updated <strong>' + response.oldLocation + '</strong> location.';
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





///EDIT PERSONNEL POPULATE MODALE 
$("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
        url: "/myProjects/project2/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {
            var resultCode = result.status.code;
            console.log(result);
            if (resultCode == 200) {
                // Update the hidden input with the employee id so that
                // it can be referenced when the form is submitted
    
                $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
    
                $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
                $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
                $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
                $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
    
                $("#editPersonnelDepartment").html("");
    
                var defaultDeptID = result.data.personnel[0].departmentID;
    
                $.each(result.data.department, function () {
                    var isSelected = (this.id == defaultDeptID) ? true : false;
                    $("#editPersonnelDepartment").append(
                        $("<option>", {
                            value: this.name, // use id for value
                            text: this.name,
                            selected: isSelected // this will set the default value
                        })
                    );
                });
            } else {
                $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
        }
    });
});

  


$("#editDepartmentModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url: "/myProjects/project2/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {
        var resultCode = result.status.code;
        console.log(result);
        if (resultCode == 200) {
          $("#editDepartmentID").val(result.data.department[0].id);
          $("#editDepartmentName").val(result.data.department[0].name);

          // Populate the location dropdown
          $("#editDepartmentLocationDropdown").html("");

          var defaultLocationID = result.data.department[0].locationID;

          $.each(result.data.locations, function () {
            var isSelected = (this.id == defaultLocationID) ? true : false;
            $("#editDepartmentLocationDropdown").append(
              $("<option>", {
                value: this.name, // use id for value
                text: this.name,
                selected: isSelected // this will set the default value
              })
            );
          });
        } else {
          $("#editDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
});



//EDIT LOCATION POPULATE MODAL
$("#editLocationModal").on("show.bs.modal", function (e) {
    
    $.ajax({
        url: "/myProjects/project2/php/getLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#editLocationID").val(result.data.location[0].id);
                $("#editLocationName").val(result.data.location[0].name);
                
            } else {
                $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
        }
    });
});

// ---------------Start Of My Code---------------------------



// ---------------Populate PERSONNEL---------------------------

let employeesData = [];

async function fetchData(departmentName, locationName) {
    try {
        const response = await $.ajax({
            url: "/myProjects/project2/php/getAllPersonnel.php",
            type: 'GET',
            dataType: 'text'
        });

        const cleanedData = response.replace("Connected successfully", "").trim();
         employeesData = JSON.parse(cleanedData);
        // console.log("Original Data:", employeesData);

        // Filter data based on department name and location name
        if (departmentName) {
            employeesData = employeesData.filter(employee => employee.departmentName.trim().toLowerCase() === departmentName.trim().toLowerCase());
        }

        if (locationName) {
            employeesData = employeesData.filter(employee => employee.locationName.trim().toLowerCase() === locationName.trim().toLowerCase());
        }

        // console.log("Filtered Data:", employeesData);
        return employeesData;

    } catch (error) {
        throw new Error("Error fetching employees data: " + error);
    }
}

const $originalTemplate = $(".employeeTemplate");

function populateEmployeesTable(data) {
    // Sort data by first name
    const sortedData = data.sort((a, b) => a.firstName.localeCompare(b.firstName));

    const $tableBody = $("#employeesTableBody");
    const $template = $originalTemplate.clone().removeClass("employeeTemplate").show();
    $tableBody.empty();

    if (sortedData) {
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

async function fetchDataAndPopulate(departmentName = null, locationName = null) {
    try {
        const data = await fetchData(departmentName, locationName);
        populateEmployeesTable(data);
    } catch (error) {
        console.error("Failed to fetch or parse data:", error);
    }
}

// Initially fetch and populate all data
fetchDataAndPopulate();

// ------------------------POPULATE DEPARTMENTS SECTION -----------------------------------


let departmentsData = [];
const $departmentTemplate = $(".departmentTemplate");

async function fetchDepartmentsData(locationName) {
    try {
        const response = await $.ajax({
            url: "/myProjects/project2/php/getAllDepartments.php",
            type: 'GET',
            dataType: 'text'
        });

        const cleanedData = response.replace("Connected successfully", "").trim();
        departmentsData = JSON.parse(cleanedData);
        // console.log("Original Data:", departmentsData);
        // console.log(locationName)
        // Filter data based on location name
        if (locationName) {
            departmentsData = departmentsData.filter(department => department.departmentLocation.trim().toLowerCase() === locationName.trim().toLowerCase());
        }

        // console.log("Filtered Data:", departmentsData);
        return departmentsData;

    } catch (error) {
        throw new Error("Error fetching departments data: " + error);
    }
}

function populateDepartmentsTable(data) {
    // Sort data by department name
    const sortedData = data.sort((a, b) => a.departmentName.localeCompare(b.departmentName));

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

async function fetchDepartmentsDataAndPopulate(locationName = null) {
    try {
        const data = await fetchDepartmentsData(locationName);
        populateDepartmentsTable(data);
    } catch (error) {
        console.error("Failed to fetch or parse department data:", error);
    }
}

// Initially fetch and populate all data
fetchDepartmentsDataAndPopulate();




// --------------------------POPULATE LOCATION SECTION ---------------------------

let locationData = [];
const $locationTemplate = $(".locationTemplate");

async function fetchLocationData(locationName) {
    try {
        const response = await $.ajax({
            url: "/myProjects/project2/php/getAllLocations.php",
            type: 'GET',
            dataType: 'text'
        });

        const cleanedData = response.replace("Connected successfully", "").trim();
        locationData = JSON.parse(cleanedData);
        
        // Filter data based on location name
        if (locationName) {
            locationData = locationData.filter(location => location.name.trim().toLowerCase() === locationName.trim().toLowerCase());
        }

        return locationData;

    } catch (error) {
        throw new Error("Error fetching location data: " + error);
    }
}

function populateLocationsTable(data) {
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

async function fetchAndPopulateLocations(locationName = null) {
    try {
        const data = await fetchLocationData(locationName);
        populateLocationsTable(data);
    } catch (error) {
        console.error("Failed to fetch or parse location data:", error);
    }
}


// Usage: without parameter it fetches and populates all locations
fetchAndPopulateLocations();



//---------------------ADD+ BUTTON MODALE ------------------------------===


// Function to populate the departments dropdown in the 'addPersonnelModal'
function populateDepartmentsForPersonnel() {
    $.ajax({
      url: "/myProjects/project2/php/getDepartments.php",  // Replace with the actual path
      type: "GET",
      dataType: "json",
      success: function(result) {
        // Assuming the result contains an array of departments
        let departments = result.data.departments;  // Adjust this based on your actual returned structure
        let selectMenu = $("#addPersonnelDepartment");  // Replace with the actual id
        selectMenu.empty(); // Clear existing options
        

        $("#addPersonnelDepartment").append(
            $("<option>", {
                value: "",
                text: "Select Department",
                selected: true,
                disabled: true
            })
        );
        
        $.each(departments, function(index, department) {
            $("#addPersonnelDepartment").append(
                $("<option>", {
                    value: department.name,
                    text: department.name
                })
            );
        });
        
      },
      error: function() {
        console.error("Error fetching departments");
      }
    });
  }
  
  function populateLocationsForDepartment() {
    $.ajax({
      url: "/myProjects/project2/php/getLocations.php",  // Replace with the actual path
      type: "GET",
      dataType: "json",
      success: function(result) {
        // Assuming the result contains an array of locations
        let locations = result.data.locations;  // Adjust this based on your actual returned structure
        let selectMenu = $("#addDepartmentLocationDropdown");  // Replace with the actual id
        selectMenu.empty(); // Clear existing options
        
        // Add a default option
        selectMenu.append(
            $("<option>", {
                value: "",
                text: "Select Location",
                selected: true,
                disabled: true
            })
        );

        // Add the locations from the result
        $.each(locations, function(index, location) {
          selectMenu.append(
            $("<option>", {
              value: location.id,
              text: location.name
            })
          );
        });
      },
      error: function() {
        console.error("Error fetching locations");
      }
    });
}




  //OPEN ADD MODALE 
  $("#addBtn").on("click", function () {
    switch (getActiveTab()) {
        case "personnel":
            $('#addPersonnelModal').on('show.bs.modal', function (e) {
                populateDepartmentsForPersonnel(); // Function for populating personnel's departments dropdown
            }).modal('show');
            break;

        case "departments":
            $('#addDepartmentModal').on('show.bs.modal', function (e) {
                populateLocationsForDepartment(); // Function for populating department's location dropdown
            }).modal('show');
            break;

        case "locations":
            $('#addLocationModal').on('show.bs.modal', function (e) {
                // No dropdown needed for locationss
            }).modal('show');
            break;
    }
});



//ADD BUTTON FUNCTIONALITY EDITED USING FORM AND SUBMIT BUTTON 
//THE ACTUAL CREATING OF THE RECORDS ON THE DB 


$("#addPersonnelForm").on("submit", function (e) {

    e.preventDefault();
    $.ajax({
        url: '/myProjects/project2/php/insertPersonnel.php',
        type: 'POST',
        dataType: 'json',
        data: {
            firstName: $("#addPersonnelFirstName").val(),
            lastName: $("#addPersonnelLastName").val(),
            departmentName:  $("#addPersonnelDepartment option:selected").text(),
            email: $("#addPersonnelEmailAddress").val()
        },
        success: function(response) {
            console.log(response);
            $('#addPersonnelModal').modal('hide');
            fetchDataAndPopulate();
            const modalMessageElement = document.getElementById("modalMessage");
            
            if (response.status.name === "failure") {
                modalMessageElement.innerText = response.status.description;
            } else if (response.status.name === "ok") {  // Considering "ok" is the successful status
                modalMessageElement.innerHTML = `Personnel <strong>${response.user}</strong> was created.`;
            }
            
            // Display the modal with the response message
            const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
            infoModal.show();
        },
        
        
    });
 });


 $("#addDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    
        $.ajax({
            url: '/myProjects/project2/php/insertDepartment.php',
            type: 'POST',
            dataType: 'json',
            data: {
                name: $("#addDepartmentName").val(),
                location:  $("#addDepartmentLocationDropdown option:selected").text(),
            },
            success: function(response) {
                $('#addDepartmentModal').modal('hide');
                fetchDepartmentsDataAndPopulate();
                const modalMessageElement = document.getElementById("modalMessage");
                            
                if (response.status.code === "404" && response.status.name === "not found") {
                    modalMessageElement.innerText = response.status.description;
                } else if (response.status.code === "400" && response.status.name === "executed") {
                    modalMessageElement.innerText = response.status.description;
                } else if (response.status.code === "200" && response.status.name === "ok") {
                    modalMessageElement.innerHTML = `Department <strong>${response.department}</strong> was created in <strong>${response.location}</strong>.`;
                }
                            
                // Display the modal with the response message
                const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
                infoModal.show();
            }
            
            
            
        });
 })

    
    
 $("#addLocationForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: '/myProjects/project2/php/insertLocation.php',
        type: 'POST',
        dataType: 'json',
        data: {
            locationName: $("#addLocationName").val()
        },
        success: function(response) {
            fetchAndPopulateLocations();
            $('#addLocationModal').modal('hide');;

            const modalMessageElement = document.getElementById("modalMessage");
                        
            if (response.status.name === "failure") {
                modalMessageElement.innerText = response.status.description;
            } else if (response.status.name === "conflict") {
                modalMessageElement.innerText = response.status.description;
            } else if (response.status.name === "ok") {
                modalMessageElement.innerHTML = `Location <strong>${response.location}</strong> was created.`;
            }
        
            // Display the modal with the response message
            const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
            infoModal.show();
        }
        
        
    });
 })



 ////FETCHING LOCATION AND DEPARTMETN TO POPULATE THE DROPDOWN ON THE FILTER DROPDOWN
 function populateFiltersInPersonnel() {
    const departmentSelectMenu = $("#filterDepartment");
    const locationSelectMenu = $("#filterLocation");
  
    // Function to create options for a select menu
    const createOptions = (selectMenu, data, placeholder) => {
      selectMenu.empty();
      // Add default option
      selectMenu.append($("<option>", {
        value: "",
        text: placeholder,
        selected: true
      }));
  
      data.forEach(item => {
        selectMenu.append($("<option>", {
          value: item.name,
          text: item.name
        }));
      });
    };
    Promise.all([
      $.ajax({url: "/myProjects/project2/php/getDepartments.php", type: "GET", dataType: "json"}),
      $.ajax({url: "/myProjects/project2/php/getLocations.php", type: "GET", dataType: "json"})
    ]).then(([departmentResult, locationResult]) => {
      // Adjust the structure based on your actual returned data
      const departments = departmentResult.data.departments;
      const locations = locationResult.data.locations;
      createOptions(departmentSelectMenu, departments, "Select a Department");
      createOptions(locationSelectMenu, locations, "Select a Location");

    }).catch(error => {
      console.error("Error fetching filter data:", error);
    });
  }
  


  function populateLocationsInDepartment() {
    $.ajax({
        url: "/myProjects/project2/php/getLocations.php", type: "GET", dataType: "json",
        success: function(result) {
            // Assuming the result contains an array of locations
            let locations = result.data.locations;  // Adjust this based on your actual returned structure
            let selectMenu = $("#filterLocationOnly");
            selectMenu.empty(); // Clear existing options

            // Add an option to not select any location
            selectMenu.append(
                $("<option>", {
                    value: "",
                    text: "Select a location...",
                    selected: true,
                    disabled: true
                })
            );
            
            $.each(locations, function(index, location) {
                selectMenu.append(
                    $("<option>", {
                        value: location.name,
                        text: location.name
                    })
                );
            });
        },
        error: function() {
            console.error("Error fetching locations");
        }
    });
}



function populateLocationsInLocations() {
    $.ajax({
        url: "/myProjects/project2/php/getLocations.php", type: "GET", dataType: "json",
        success: function(result) {
            // Assuming the result contains an array of locations
            let locations = result.data.locations;  // Adjust this based on your actual returned structure
            let selectMenu = $("#selectLocationOnly");
            selectMenu.empty(); // Clear existing options

            // Add an option to not select any location
            selectMenu.append(
                $("<option>", {
                    value: "",
                    text: "Select a location...",
                    selected: true,
                    disabled: true
                })
            );
            
            $.each(locations, function(index, location) {
                selectMenu.append(
                    $("<option>", {
                        value: location.name,
                        text: location.name
                    })
                );
            });
        },
        error: function() {
            console.error("Error fetching locations");
        }
    });
}



 //FILTER BUTTON OPEN MODALE and populating the filter modales with correct values.
// FILTER BUTTON OPEN MODALS
$("#filterBtn").click(function () {
    switch (getActiveTab()) {
        case "personnel":
            $('#filterModal').on('show.bs.modal', function (e) {
                populateFiltersInPersonnel(); // Function for populating filters
            }).modal('show');
            break;

        case "departments":
            $('#filterByLocationModal').on('show.bs.modal', function (e) {
                populateLocationsInDepartment(); // Function for populating department locations
            }).modal('show');
            break;

        case "locations":
            $('#filterByLocationOnlyModal').on('show.bs.modal', function (e) {
                populateLocationsInLocations(); // Function for populating locations
            }).modal('show');
            break;
    }
});




// Event listener for Apply Filters button
$("#applyFilterBtn").on("click", function () {
    const selectedDepartment = $("#filterDepartment").val();
    const selectedLocation = $("#filterLocation").val();
    $('#filterModal').modal('hide');
    fetchDataAndPopulate(selectedDepartment, selectedLocation);
});

//Filter Department
$("#applyLocationFilterBtn").on("click", function () {
    const selectedLocation = $("#filterLocationOnly").val();
    $('#filterByLocationModal').modal('hide');
    fetchDepartmentsDataAndPopulate( selectedLocation);
});

//Filter Location 
$("#applyLocationOnlyFilterBtn").on("click", function () {
    const selectedLocation = $("#selectLocationOnly").val();
    $('#filterByLocationOnlyModal').modal('hide');
    fetchAndPopulateLocations(selectedLocation);
});








// ------------------------DELETE MODALE-----------------------------------




function deletePersonnelById(id) {

    $.ajax({
        url: `/myProjects/project2/php/deletePersonnel.php?id=${id}`,///should check first 
        type: 'DELETE',
        success: function(response) {
            // Check the response status code
            if (response.status && response.status.code == "200") {
                fetchDataAndPopulate();
                console.log("Successfully deleted personnel:", response.data.firstName, response.data.lastName);
                document.getElementById("modalMessage").innerHTML = "Successfully deleted personnel: <strong>" + response.data.firstName + " " + response.data.lastName + "</strong>";
            } else {
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
        url: '/myProjects/project2/php/deleteDepartment.php',
        type: 'POST',   // Change type to POST
        data: { id: id },   
        success: function(response) {
            var modalMessageElement = document.getElementById("modalMessage");
            
            if (response.status.name === "failure") {
                modalMessageElement.innerText = response.status.description;
                
            } else if (response.status.name === "success") {
                modalMessageElement.innerHTML = `Successfully deleted department: <strong>${response.data.departmentName}</strong> `;
                // document.getElementById("modalMessage").innerHTML = "Successfully deleted department: <strong>" + response.data.departmentName + "</strong>"
               
                // or locationName if you're working with locations
            }
            
            fetchDepartmentsDataAndPopulate();
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
        url: '/myProjects/project2/php/deleteLocation.php',
        type: 'POST',
        data: { id: id },
        success: function(response) {
            var modalMessageElement = document.getElementById("modalMessage");
            
            if (response.status.name === "failure") {
                modalMessageElement.innerText = response.status.description;
                
            } else if (response.status.name === "success") {
                modalMessageElement.innerHTML = `Successfully deleted location: <strong>${response.data.locationName}</strong> `;
            }
            
            fetchAndPopulateLocations()
            const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
            infoModal.show();
        },
        error: function(error) {
            console.error("Failed to delete location:", error);
        }
    });
}





///ORDER OF THE DELETE BUTTON 

//1- IT WILL CHECK IF THE BUTTON HAS DEPENDENCIES AND IT WILL DECIDE TO SHOW THE "CAN NOT DELETE" OR "ARE YOU SURE YOU WANT TO DELETE"

// Event Listeners for Delete Buttons it will check if the Record have dependencies

$(document).on("click", ".deletePersonnelBtn", function() {
    
    const employeeName = $(this).closest("tr").find(".employeeName").text();
    const itemId = $(this).attr("data-id")

    if (employeeName) {
        $("#itemNameToDelete").html(`<strong>${employeeName}</strong>`);
        $("#deleteConfirmationModal").modal("show");
        $(".confirmDelete").data('type', 'personnel').data('id', itemId);
    }
});




$(document).on("click", ".deleteDepartmentBtn", function() {
    console.log("delete department clicked");
    const itemId = $(this).attr("data-id");
    
    $.ajax({
        url: "/myProjects/project2/php/checkDepartmentUse.php",
        type: "POST",
        dataType: "json",
        data: {
            id: itemId
        },
        success: function (result) {
            var modalMessageElement = document.getElementById("modalMessage");
            // Reset or clear the modal message content
            modalMessageElement.innerHTML = "";

            if (result.status.code == 200) {
                const departmentName = result.data[0].departmentName;
                const personnelCount = result.data[0].personnelCount;
                $("#itemNameToDelete").html(`<strong>${departmentName}</strong>`);
                
                if (personnelCount == 0) {
                    $("#deleteConfirmationModal").modal("show");
                } else {
                    modalMessageElement.innerHTML = `You cannot remove the entry for "<strong>${departmentName}</strong>" because it has <strong>${personnelCount}</strong> employees assigned to it.`;
                    const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
                    infoModal.show();
                }
                
                $(".confirmDelete").data('type', 'department').data('id', itemId);
            } else {
                $("#exampleModal .modal-title").replaceWith("Error retrieving data");
            }
        },
        
        error: function (jqXHR, textStatus, errorThrown) {
            $("#exampleModal .modal-title").replaceWith("Error retrieving data");
        }
    });
});





$(document).on("click", ".deleteLocationBtn", function() {
    console.log("delete location clicked");
    const itemId = $(this).attr("data-id");
    
    $.ajax({
        url: "/myprojects/project2/php/checkLocationUse.php",
        type: "POST",
        dataType: "json",
        data: {
            id: itemId
        },
        success: function (result) {
            var modalMessageElement = document.getElementById("modalMessage");
            modalMessageElement.innerHTML = "";

            if (result.status.code == 200) {
                const locationName = result.data[0].locationName;
                const departmentCount = result.data[0].departmentCount;
                $("#itemNameToDelete").html(`<strong>${locationName}</strong>`);
                
                if (departmentCount == 0) {
                    $("#deleteConfirmationModal").modal("show");
                } else {
                    modalMessageElement.innerHTML = `You cannot remove the entry for "<strong>${locationName}</strong>" because it has <strong>${departmentCount}</strong> departments associated with it.`;
                    const infoModal = new bootstrap.Modal(document.getElementById('responseModal'));
                    infoModal.show();
                }
                
                $(".confirmDelete").data('type', 'location').data('id', itemId);
            } else {
                $("#exampleModal .modal-title").replaceWith("Error retrieving data");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#exampleModal .modal-title").replaceWith("Error retrieving data");
        }
    });
});




//THIS WILL BE THE ACTUAL DELETE ACTION 


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






//----------------Search Button--------------------LOGIC----------------------
function searchPersonnel() {
    let query = $('#searchInp').val(); 

    $.ajax({
        url: '/myProjects/project2/php/searchPersonnel.php', 
        method: 'POST',
        data: { searchTerm: query }, 
        dataType: 'json',
        success: function(response) {
           
            displaySearchResults(response);
        },
        error: function(xhr, status, error) {
            console.error("Search failed:", error);
            
        }
    });
}



function displaySearchResults(results) {
    const tableBody = $("#employeesTableBody");
    tableBody.empty(); // Clear current rows

    results.forEach(person => {
        let clonedRow = $(".employeeTemplate").clone().removeClass("employeeTemplate").show();
        
        clonedRow.find(".employeeName").text(person.firstname + " " + person.lastname);
        clonedRow.find(".employeeDepartment").text(person.departmentName);
        clonedRow.find(".employeeLocation").text(person.locationName);
        clonedRow.find(".employeeEmail").text(person.email);

        // If you need to set specific IDs or other attributes for the edit or delete buttons, you can do that here.
        clonedRow.find(".editEmployeeBtn").attr("data-id", person.id); // Assuming your PHP sends back an 'id' field
        clonedRow.find(".deletePersonnelBtn").attr("data-id", person.id);

        tableBody.append(clonedRow);
    });
}




///////////////////////////////////


function searchDepartment() {
    let query = $('#searchInp').val();

    $.ajax({
        url: '/myProjects/project2/php/searchDepartment.php', 
        method: 'POST',
        data: { searchTerm: query }, 
        dataType: 'json',
        success: function(response) {
            displayDepartmentResults(response);
        },
        error: function(xhr, status, error) {
            console.error("Search failed:", error);
           
        }
    });
}

function displayDepartmentResults(results) {
    const tableBody = $("#departmentsTableBody");
    tableBody.empty(); // Clear current rows

    results.forEach(department => {
        let clonedRow = $(".departmentTemplate").clone().removeClass("departmentTemplate").show(); // Assuming you have a similar template row for departments
        
        clonedRow.find(".departmentName").text(department.departmentName);
        clonedRow.find(".departmentLocation").text(department.locationName);

        // If you need to set specific IDs or other attributes for the edit or delete buttons, you can do that here.
        clonedRow.find(".editDepartmentBtn").attr("data-id", department.id); // Assuming your PHP sends back an 'id' field for departments
        clonedRow.find(".deleteDepartmentBtn").attr("data-id", department.id);

        tableBody.append(clonedRow);
    });
}
////////////////////////////

function searchLocation() {
    let query = $('#searchInp').val(); // Get the value of the search input

    $.ajax({
        url: '/myProjects/project2/php/searchLocation.php',
        method: 'POST',
        data: { searchTerm: query },
        dataType: 'json',
        success: function(response) {
            displayLocationResults(response);
        },
        error: function(xhr, status, error) {
            console.error("Search failed:", error);
            // Handle any errors here, maybe show a user-friendly message
        }
    });
}

function displayLocationResults(results) {
    const tableBody = $("#locationsTableBody");  // Assume this is the ID of the table body for locations
    tableBody.empty(); // Clear current rows

    results.forEach(location => {
        let clonedRow = $(".locationTemplate").clone().removeClass("locationTemplate").show();  // Assume you have a similar template row for locations

        clonedRow.find(".locationName").text(location.name); // Assuming there's a column to display location name

        // If you need to set specific IDs or other attributes for the edit or delete buttons, you can do that here.
        clonedRow.find(".editLocationBtn").attr("data-id", location.id);  // Assuming your PHP sends back an 'id' field
        clonedRow.find(".deleteLocationBtn").attr("data-id", location.id);

        tableBody.append(clonedRow);
    });
}

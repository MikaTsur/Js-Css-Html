function getEmployeeByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function updateEmployee(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get values from the form inputs
    var newFirstName = document.getElementById("newFirstName").value;
    var newLastName = document.getElementById("newLastName").value;
    var newStartYear = document.getElementById("newStartYear").value;
    var newDepartmentID = document.getElementById("newDepartmentID").value;

    // Get Employee ID from the URL
    var employeeId = getEmployeeByName("employeeId");

    // Update the content of the first row
    document.getElementById("displayEmployeeFisrtName").innerHTML = "<b>" + newFirstName + "</b>";
    document.getElementById("displayEmployeeLastName").innerHTML = "<b>" + newLastName + "</b>";
    document.getElementById("displayEmployeeYear").innerHTML = "<b>" + newStartYear + "</b>";
    document.getElementById("displayEmployeeDepartment").innerHTML = "<b>" + newDepartmentID + "</b>";

    // AJAX request to update the backend
    var url = "https://localhost:7201/api/Employees/" + employeeId;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: employeeId,
            firstname: newFirstName,
            lastname: newLastName,
            startWorkYear: parseInt(newStartYear), // Convert to integer
            departmentID: newDepartmentID
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success if needed
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle error if needed
        });
}
// Drop Down list functionallity
document.addEventListener('DOMContentLoaded', function () {
    
    fetch('https://localhost:7201/api/Departments')
        .then(response => response.json())
        .then(data => {
            // Populate the dropdown with department options
            var departmentDropdown = document.getElementById('newDepartmentID');
            data.forEach(department => {
                var option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.departmentName;
                departmentDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching departments:', error));
});

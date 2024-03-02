// initialize input value from ui
document.getElementById('searchInput').addEventListener('input', function () {
    let searchInputValue = this.value.trim();
    updateSearchResults(searchInputValue);
    console.log(searchInputValue)
});


// search.js
document.addEventListener("DOMContentLoaded", function () {
    searchEmployeeByInput();
});

async function updateSearchResults(searchInputValue) {
    let tableBody = document.querySelector("#SearchemployeeTable tbody");
    let matchingEmployees = await searchEmployeeByInput(searchInputValue, tableBody);
    console.log("Matching Employees:", matchingEmployees);

    // If you want to do something with matchingEmployees in the calling code
    return matchingEmployees;
}


// Function to search employees based on input
async function searchEmployeeByInput(searchInputValue, tableBody) {
    try {
        console.log("Search input value:", searchInputValue);

        let resp = await fetch("https://localhost:7201/api/Employees");
        if (!resp.ok) {
            throw new Error(`Error fetching Employees: ${resp.status} ${resp.statusText}`);
        }
        
        // Log the received data
        let data = await resp.json();
        console.log("Received employees data:", data);

        // Clear existing content
        tableBody.innerHTML = '';

        // Array to store matching employees
        let matchingEmployees = [];

        // Iterate through the response array
        for (let employee of data) {
            // Check if the values match exactly
            if (
                employee.firstname === searchInputValue ||
                employee.lastname === searchInputValue ||
                employee.departmentID.toString() === searchInputValue
            ) {
                // Match found, add to the array
                matchingEmployees.push(employee);
            }
        }

        // Populate the table body with search results
        matchingEmployees.forEach(employee => {
            let row = tableBody.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
            let cell6 = row.insertCell(5);
            let cell7 = row.insertCell(6);
            let cell8 = row.insertCell(7);

            cell1.textContent = employee.id;
            cell2.textContent = employee.firstname;
            cell3.textContent = employee.lastname;
            cell4.textContent = employee.startWorkYear;
            cell5.textContent = employee.departmentID;
            cell6.textContent = employee.Shifts;

            //add shift link
            let addShiftLink = document.createElement("a");
            addShiftLink.textContent = "Add Shift";
            addShiftLink.href = "#";
            addShiftLink.addEventListener("click", () => redirectToAddShiftPage(employee.id));
            cell6.appendChild(addShiftLink);

            // Add edit button
            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => redirectToEditEmployeePage(employee.id));
            cell7.appendChild(editButton);

            // Add delete button
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteEmployee(employee.id));
            cell8.appendChild(deleteButton);
        });

        // Return the array of matching employees
        return matchingEmployees;

    } catch (error) {
        console.error(`Error fetching Employees: ${error.message}`);
        // Return an empty array or handle the error based on your needs
        return [];
    }
}


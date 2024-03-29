document.addEventListener("DOMContentLoaded", function () {
    getDepartments();
});

// Brings the data from the db
async function getDepartments() {
    try {
        let resp = await fetch("https://localhost:7201/api/Departments");
        if (!resp.ok) {
            throw new Error(`Error fetching departments: ${resp.status} ${resp.statusText}`);
        }

        updateUserCounter('GET');

        let data = await resp.json();
        displayDepartments(data);
    } catch (error) {
        console.error(`Error fetching departments: ${error.message}`);
    }
}

function displayDepartments(data) {
    // Get the table body element
    const tableBody = document.querySelector("#departmentTable tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Populate the table dynamically
    data.forEach(async department => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.textContent = department.id;
        cell2.textContent = department.departmentName;
        cell3.textContent = department.managerId;

        // Add edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => redirectToEditPage(department.id));

        cell4.appendChild(editButton);

        // Check if there are employees in the department
        const hasEmployees = await hasEmployeesInDepartment(department.id);

        // Add delete button only if there are no employees in the department
        if (!hasEmployees) {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteDepartment(department.id));
            cell5.appendChild(deleteButton);
        }
    });
}


// Add Department functionality
async function addDepartment() {
    // Get form data
    const departmentName = document.getElementById("departmentName").value;
    const managerId = parseInt(document.getElementById("managerId").value);

    // Prepare department object
    const newDepartment = {
        departmentName: departmentName,
        managerId: managerId
    };

    try {
        // Make POST request to add a new department
        let resp = await fetch("https://localhost:7201/api/Departments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDepartment)
        });

        if (!resp.ok) {
            throw new Error(`Error adding department: ${resp.status} ${resp.statusText}`);
        }
        updateUserCounter('POST');

        // Refresh the department table after adding a new department
        getDepartments();
    } catch (error) {
        console.error(`Error adding department: ${error.message}`);
    }
}

function redirectToEditPage(departmentId) {
    window.location.href = `editDepartment.html?departmentId=${departmentId}`;
}

async function deleteDepartment(departmentId) {
    // Check if there are employees in the department
    const hasEmployees = await hasEmployeesInDepartment(departmentId);

    if (hasEmployees) {
        // Display a message or take appropriate action
        alert("Cannot delete the department with employees.");
        return;
    }

    try {
        // Make DELETE request to delete the department
        let resp = await fetch(`https://localhost:7201/api/Departments?id=${departmentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!resp.ok) {
            throw new Error(`Error deleting department: ${resp.status} ${resp.statusText}`);
        }

        updateUserCounter('DELETE');

        // Refresh the department table after deleting a department
        getDepartments();
    } catch (error) {
        console.error(`Error deleting department: ${error.message}`);
    }
}

async function hasEmployeesInDepartment(departmentId) {
    try {
        // Make GET request to check if there are employees in the department
        let resp = await fetch(`https://localhost:7201/api/Employees`);

        if (!resp.ok) {
            throw new Error(`Error checking employees: ${resp.status} ${resp.statusText}`);
        }

        updateUserCounter('UPDATE');

        let data = await resp.json();

        // Check if there are any employees with the specified departmentId
        return data.some(employee => employee.departmentID === departmentId);
    } catch (error) {
        console.error(`Error checking employees: ${error.message}`);
        // Assume there are employees in case of an error
        return true;
    }
}

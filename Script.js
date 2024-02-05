document.addEventListener("DOMContentLoaded", function () {
    getDepartments();
});

async function getDepartments() {
    try {
        let resp = await fetch("https://localhost:7201/api/Departments");
        if (!resp.ok) {
            throw new Error(`Error fetching departments: ${resp.status} ${resp.statusText}`);
        }

        let data = await resp.json();
        displayDepartments(data);
    } catch (error) {
        console.error(`Error fetching departments: ${error.message}`);
    }
}

function displayDepartments(data) {
    // Get the table body element
    let tableBody = document.querySelector("#departmentTable tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Populate the table dynamically
    data.forEach(department => {
        let row = tableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);

        cell1.textContent = department.id;
        cell2.textContent = department.departmentName;
        cell3.textContent = department.managerId;

        // Add edit and delete buttons
        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => redirectToEditPage(department.id));

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteDepartment(department.id));

        cell4.appendChild(editButton);
        cell5.appendChild(deleteButton);
    });
}

async function addDepartment() {
    // Get form data
    let departmentName = document.getElementById("departmentName").value;
    let managerId = parseInt(document.getElementById("managerId").value);

    // Prepare department object
    let newDepartment = {
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

        // Refresh the department table after adding a new department
        getDepartments();
    } catch (error) {
        console.error(`Error adding department: ${error.message}`);
    }
}

function redirectToEditPage(departmentId) {
    // Redirect to the API endpoint for editing a department using the departmentId
    window.location.href = `https://localhost:7201/api/Departments/${departmentId}`;
}


async function deleteDepartment(departmentId) {
    try {
        // Make DELETE request to delete the department
        let resp = await fetch(`https://localhost:7201/api/Departments/${departmentId}`, {
            method: "DELETE"
        });

        if (!resp.ok) {
            throw new Error(`Error deleting department: ${resp.status} ${resp.statusText}`);
        }

        // Refresh the department table after deleting a department
        getDepartments();
    } catch (error) {
        console.error(`Error deleting department: ${error.message}`);
    }
}

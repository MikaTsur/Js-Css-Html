document.addEventListener("DOMContentLoaded", function () {
    getEmployees();
});

async function getEmployees() {
    try {
        let resp = await fetch("https://localhost:7201/api/Employees");
        if (!resp.ok) {
            throw new Error(`Error fetching Employees: ${resp.status} ${resp.statusText}`);
        }
        updateUserCounter('GET');
        let data = await resp.json();
        displayEmployees(data);
    } catch (error) {
        console.error(`Error fetching Employees: ${error.message}`);
    }
}

async function displayEmployees(employees) {
    console.log("Received employees data:", employees);
    let tableBody = document.querySelector("#employeeTable tbody");
    tableBody.innerHTML = "";

    employees.forEach(employee => {
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
        addShiftLink.addEventListener("click", () =>redirectToAddShiftPage(employee.id));
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
}


function redirectToEditEmployeePage(employeeId) {
    window.location.href = `editEmployee.html?employeeId=${employeeId}`;
}

function redirectToAddShiftPage(employeeId) {
    window.location.href = `Add_shift_to_employee.html?employeeId=${employeeId}`;
}

async function deleteEmployee(employeeId) {
    try {
        let resp = await fetch(`https://localhost:7201/api/Employees?id=${employeeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!resp.ok) {
            throw new Error(`Error deleting employee: ${resp.status} ${resp.statusText}`);
        }
        updateUserCounter('DELETE');


        getEmployees();
    } catch (error) {
        console.error(`Error deleting employee: ${error.message}`);
    }
}
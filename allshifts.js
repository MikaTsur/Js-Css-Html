document.addEventListener("DOMContentLoaded", function () {
    getShifts();
});

async function getShifts() {
    try {
        let shiftsResp = await fetch("https://localhost:7201/api/EmployeesShifts");
        let employeesResp = await fetch("https://localhost:7201/api/Employees");
        let shiftsInfoResp = await fetch("https://localhost:7201/api/Shifts");

        if (!shiftsResp.ok || !employeesResp.ok || !shiftsInfoResp.ok) {
            throw new Error(`Error fetching data: ${shiftsResp.status} ${shiftsResp.statusText}`);
        }

        let shiftsData = await shiftsResp.json();
        let employeesData = await employeesResp.json();
        let shiftsInfoData = await shiftsInfoResp.json();
        updateUserCounter('GET');

        displayShifts(shiftsData, employeesData, shiftsInfoData);
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
    }
}

function displayShifts(shifts, employees, shiftsInfo) {
    let groupedShifts = {};
    let addedShifts = {};

    // Group shifts by date and hours
    shifts.forEach(shift => {
        let shiftInfo = shiftsInfo.find(info => info.id === shift.shiftID);
        let employee = employees.find(emp => emp.id === shift.employeeID);

        if (shiftInfo && employee) {
            let key = `${shiftInfo.date}_${shiftInfo.startTime}_${shiftInfo.endTime}`;
            if (!groupedShifts[key]) {
                groupedShifts[key] = {
                    date: shiftInfo.date,
                    startTime: shiftInfo.startTime,
                    endTime: shiftInfo.endTime,
                    employees: []
                };
            }

            // Sort shifts by date in descending order
            shifts.sort((a, b) => {
                const dateA = shiftsInfo.find(info => info.id === a.shiftID)?.date || '';
                const dateB = shiftsInfo.find(info => info.id === b.shiftID)?.date || '';
                return new Date(dateB) - new Date(dateA);
            });

            groupedShifts[key].employees.push(employee);
            addedShifts[shift.shiftID] = true;
        }
    });

    let tableBody = document.querySelector("#shiftsTable tbody");
    tableBody.innerHTML = "";

    // Display grouped shifts and corresponding employees
    for (const key in groupedShifts) {
        if (groupedShifts.hasOwnProperty(key)) {
            let row = tableBody.insertRow();
            let [date, startHour, endHour] = key.split("_");

            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);

            // Display only the date in the "Date" column
            cell1.textContent = date.split('T')[0];
            cell2.textContent = `${startHour}-${endHour}`;

            // Display employee names for the current group
            groupedShifts[key].employees.forEach(employee => {
                let employeeLink = document.createElement("a");
                employeeLink.href = `editEmployee.html?employeeId=${employee.id}`;
                employeeLink.textContent = `${employee.firstname} ${employee.lastname}`;
                employeeLink.style.display = "block"; // Make the link a block element for better styling

                // Add an event listener to the link
                employeeLink.addEventListener("click", function (event) {
                    //event.preventDefault();
                    //updateEmployee(employee.id);
                });

                cell3.appendChild(employeeLink);

                // Add a line break after each employee link
                cell3.appendChild(document.createElement("br"));
            });
        }
    }
}

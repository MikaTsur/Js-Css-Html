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

    // Group shifts by date, hours, and employee
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

            // Add employee information to the current shift group
            groupedShifts[key].employees.push(`${employee.firstname} ${employee.lastname}`);
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

            // Display date in the "Date" column
            cell1.textContent = date.split('T')[0];

            // Display hours in the "Hours" column
            cell2.textContent = `${startHour}-${endHour}`;

            // Display employee names in the "Employees" column
            cell3.textContent = groupedShifts[key].employees.join(', ');
        }
    }
}

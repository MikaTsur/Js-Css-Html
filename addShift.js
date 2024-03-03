// Function to get a parameter from the URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Function to generate options for the next upcoming week
function generateShiftOptions() {
    const shiftTimeSelect = document.getElementById('shiftTime');
    shiftTimeSelect.innerHTML = '';

    // Add options for the two shifts
    const shifts = [
        { start: 7, end: 14 },
        { start: 14, end: 21 }
    ];

    for (const shift of shifts) {
        const option = document.createElement('option');

        option.value = `${shift.start}-${shift.end}`;
        option.text = `${shift.start}:00 - ${shift.end}:00`;
        shiftTimeSelect.add(option);
    }
}

// Call the function to generate options when the page loads
generateShiftOptions();

// Call the function to generate options when the page loads
async function updateShift(event) {
    event.preventDefault();

    const employeeName = document.getElementById('EmployeeName').value;
    const dateShift = document.getElementById('shiftDate').value;
    const shiftTime = document.getElementById('shiftTime').value;
    const employeeId = getParameterByName('employeeId');

    // Extract start and end hours from shiftTime
    const [startHour, endHour] = shiftTime.split('-').map(hour => parseInt(hour));

    // Update the content as needed
    document.getElementById('displayEmployeeName').innerHTML = '<b>' + employeeName + '</b>';
    document.getElementById('displayShift').innerHTML = '<b>' + dateShift + ' ' + startHour + '-' + endHour + '</b>';

    try {
        // AJAX request to update the backend for Shifts
        const shiftsUrl = 'https://localhost:7201/api/Shifts/';

        const response = await fetch(shiftsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: dateShift,
                startTime: startHour,
                endTime: endHour
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update shift: ' + response.statusText);
        }

        const shiftData = await response.json();

        // Fetch the list of shifts to determine the last shift ID
        const lastShiftId = shiftData.id;

        // Additional logic for updating the EmployeesShifts table
        await updateEmployeeShiftsTable(employeeId, lastShiftId);
    } catch (error) {
        console.error('Error updating shift:', error);
        // Handle error if needed
    }
}

async function updateEmployeeShiftsTable(employeeId, lastShiftId) {
    try {
        const employeesShiftsUrl = 'https://localhost:7201/api/EmployeesShifts/';

        const response = await fetch(employeesShiftsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0, 
                employeeID: employeeId,
                shiftID: lastShiftId
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update EmployeesShifts table: ' + response.statusText);
        }

        const data = await response.json();

        console.log('Success updating EmployeesShifts:', data);
        // Handle success if needed
    } catch (error) {
        console.error('Error updating EmployeesShifts:', error);
        // Handle error if needed
    }
}

// addShift.js

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
function updateShift(event) {
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

    // AJAX request to update the backend for Shifts
    const shiftsUrl = 'https://localhost:7201/api/Shifts/';

    fetch(shiftsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: dateShift,
            startTime: startHour,
            endTime: endHour
        }),
    })
    .then(response => {
        if (response.ok) {
            updateUserCounter('POST');
            return response.json();
        } else {
            throw new Error('Failed to update shift: ' + response.statusText);
        }
    })
    .then(shiftData => {
        // Fetch the list of shifts to determine the last shift ID
        const lastShiftId = shiftData.id;

        // Additional logic for updating the EmployeesShifts table
        updateEmployeeShiftsTable(employeeId, lastShiftId);
    })
    .catch(error => {
        console.error('Error updating shift:', error);
        // Handle error if needed
    });
}

function updateEmployeeShiftsTable(employeeId, lastShiftId) {
    const employeesShiftsUrl = 'https://localhost:7201/api/EmployeesShifts/';

    fetch(employeesShiftsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: 0, // Assuming the ID is auto-incremented
            employeeID: employeeId,
            shiftID: lastShiftId
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update EmployeesShifts table: ' + response.statusText);
        }
        updateUserCounter('POST');
        return response.json();
    })
    .then(data => {
        console.log('Success updating EmployeesShifts:', data);
        // Handle success if needed
    })
    .catch(error => {
        console.error('Error updating EmployeesShifts:', error);
        // Handle error if needed
    });
}

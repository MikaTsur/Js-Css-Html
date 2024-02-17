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
function updateShift(event) {
    event.preventDefault();

    const employeeName = document.getElementById('EmployeeName').value;
    const dateShift = document.getElementById('shiftDate').value;
    const shiftTime = document.getElementById('shiftTime').value;

    // Extract start and end hours from shiftTime
    const [startHour, endHour] = shiftTime.split('-').map(hour => parseInt(hour));

    // Get shiftId from the URL
    const shiftId = getParameterByName('shiftId');

    // Update the content as needed
    document.getElementById('displayEmployeeName').innerHTML = '<b>' + employeeName + '</b>';
    document.getElementById('displayShift').innerHTML = '<b>' + dateShift + ' ' + startHour + '-' + endHour + '</b>';

    // AJAX request to update the backend
    const url = 'https://localhost:7201/api/Shifts/'

    fetch(url, {
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
        if (!response.ok) {
            throw new Error('Failed to update shift: ' + response.statusText);
        }

        // No need to return JSON if status is 204 No Content
        if (response.status === 204) {
            return null;
        }

        return response.json();
    })
    .then(updatedShiftData => {
        if (updatedShiftData) {
            console.log('Success:', updatedShiftData);
        }

        // Fetch the list of shifts to determine the last shift ID
        const shiftsUrl = 'https://localhost:7201/api/Shifts/';
        return fetch(shiftsUrl);
    })
    .then(shiftsResponse => {
        if (!shiftsResponse.ok) {
            throw new Error('Failed to fetch shifts data: ' + shiftsResponse.statusText);
        }

        return shiftsResponse.json();
    })
    .then(shiftsData => {
        if (shiftsData && shiftsData.length > 0) {
            // Assuming the shifts are sorted by ID in descending order, so the first one is the last shift
            const lastShiftId = shiftsData[0].id;

            // Log the last shift ID (you can use it in the next steps)
            console.log('Last Shift ID:', lastShiftId);

            // Additional logic for updating the employeeShifts table
            // Call the function to update the employeeShifts table with shiftId and lastShiftId
            updateEmployeeShiftsTable(shiftId, lastShiftId);
        } else {
            console.error('No shifts data received.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error if needed
    });
}


// Call the function to generate options when the page loads
generateShiftOptions();
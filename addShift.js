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
    const employeeId = getParameterByName('employeeId');


    // Extract start and end hours from shiftTime
    const [startHour, endHour] = shiftTime.split('-').map(hour => parseInt(hour));


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
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update shift: ' + response.statusText);
        }
    })
    .then(data => {
        console.log('Success:', data);

        // Fetch the list of shifts to determine the last shift ID
        const shiftsUrl = 'https://localhost:7201/api/Shifts/';
        console.log('Before fetching shifts data');
        return fetch(shiftsUrl);
    })
    .then(shiftsResponse => {
        if (!shiftsResponse.ok) {
            throw new Error('Failed to fetch shifts data: ' + shiftsResponse.statusText);
        }

        return shiftsResponse.json();
    })
    .then(shiftsData => {
        console.log('Shifts Data:', shiftsData);
    
        if (shiftsData && shiftsData.length > 0) {
            // Assuming the shifts are not sorted, so let's sort them by ID in descending order
            const sortedShifts = shiftsData.sort((a, b) => b.id - a.id);
    
            // Get the first shift after sorting, which is the one with the highest ID (last shift)
            const lastShiftId = sortedShifts[0].id;
    
            // Log the last shift ID (you can use it in the next steps)
            console.log('Last Shift ID:', lastShiftId);
    
            // Additional logic for updating the employeeShifts table
            // Call the function to update the employeeShifts table with shiftId and lastShiftId
            updateEmployeeShiftsTable(employeeId, lastShiftId);
        } else {
            console.error('No shifts data received.');
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
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
            id: 0,
            employeeID: employeeId,
            shiftID: lastShiftId
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update EmployeesShifts table: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Handle success if needed
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error if needed
        });
}


// Call the function to generate options when the page loads
generateShiftOptions();
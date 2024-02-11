// addShift.js

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

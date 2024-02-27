document.addEventListener('DOMContentLoaded', function () {
    // Assuming you have a function to check if the user is authenticated
    if (isUserAuthenticated()) {
        redirectToHomePage(); // Redirect if authenticated
    }

    // Get references to the buttons
    const employeesBtn = document.getElementById('employeesBtn');
    const departmentsBtn = document.getElementById('departmentsBtn');
    const shiftsBtn = document.getElementById('shiftsBtn');

    // Attach event listeners to the buttons
    employeesBtn.addEventListener('click', redirectToEmployeesPage);
    departmentsBtn.addEventListener('click', redirectToDepartmentsPage);
    shiftsBtn.addEventListener('click', redirectToShiftsPage);

    // ... (your existing code) ...
});

function redirectToEmployeesPage() {
    window.location.href = 'employees.html';
}

function redirectToDepartmentsPage() {
    window.location.href = 'index.html';
}

function redirectToShiftsPage() {
    window.location.href = 'allshifts.html';
}

function isUserAuthenticated() {
    // Your logic to check if the user is authenticated
    // For example, checking the presence of a token in localStorage
    return localStorage.getItem('token') !== null;
}

function redirectToHomePage() {
    window.location.href = 'homepage.html';
}
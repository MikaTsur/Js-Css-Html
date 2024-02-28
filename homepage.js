document.addEventListener('DOMContentLoaded', function () {
    // Assuming you have a function to check if the user is authenticated
    if (isUserAuthenticated()) {
        redirectToHomePage(); // Redirect if authenticated
    }

    // handle local storage
    let fullnamedisplay = localStorage.getItem('fullname');
    console.log(fullnamedisplay)
    const welcomeHeader = document.getElementById('welcomeHeader');
    if (welcomeHeader) {
        welcomeHeader.textContent = fullnamedisplay
            ? ` ${fullnamedisplay}*   Welcome to the Home Page`
            : 'Welcome to the Home Page'; // Set a default value if fullnamedisplay is null or undefined
    }

    const employeesBtn = document.getElementById('employeesBtn');
    const departmentsBtn = document.getElementById('departmentsBtn');
    const shiftsBtn = document.getElementById('shiftsBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Attach event listeners to the buttons Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
    employeesBtn.addEventListener('click', redirectToEmployeesPage);
    departmentsBtn.addEventListener('click', redirectToDepartmentsPage);
    shiftsBtn.addEventListener('click', redirectToShiftsPage);
    logoutBtn.addEventListener('click', redirectToLoginPage);

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

function redirectToLoginPage() {

    window.location.href = 'loginpage.html';
}
document.addEventListener('DOMContentLoaded', function () {
    // Assuming you have a function to check if the user is authenticated
    if (isUserAuthenticated()) {
        redirectToHomePage(); // Redirect if authenticated
    }

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Perform the login API request
        login(username, password);
    });
});

function isUserAuthenticated() {
    // Your logic to check if the user is authenticated
    // For example, checking the presence of a token in localStorage
    return localStorage.getItem('token') !== null;
}

function redirectToHomePage() {
    window.location.href = 'homepage.html';
}

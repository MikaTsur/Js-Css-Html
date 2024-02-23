document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Perform the login API request
        login(username, password);
    });
});

// Login functionality
function login(username, password) {
    const apiUrl = 'https://localhost:7201/api/Users/login';

    const payload = {
        userName: username,
        password: password
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Login successful:', data);

        // Store the user token securely (e.g., in a cookie or using browser storage)
        document.cookie = `userToken=${data.token}; path=/`;

        // Redirect to the homepage with user information
        window.location.href = `homepage.html?fullName=${encodeURIComponent(data.fullName)}&numOfActions=${encodeURIComponent(data.numOfActions)}`;
    })
    .catch(error => {
        console.error('Login error:', error);
        // Handle errors
    });
}

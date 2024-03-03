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

// Login functionality with added user activity counter
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
            localStorage.setItem('numOfActions', data.numOfActions);
            localStorage.setItem('fullname', data.fullName);

            // Update user activity counters in localStorage
            updateUserCounter('login');

            // Redirect to the homepage with user information
            window.location.href = `homepage.html?fullName=${encodeURIComponent(data.fullName)}&=${encodeURIComponent(data.numOfActions)}`;
        })
        .catch(error => {
            console.error('Login error:', error);
            
            // Display alert for incorrect credentials or non-200 response
            if (error.message === 'Login failed') {
                alert('Incorrect username or password. Please try again.');
            } else {
                alert('An error occurred during login. Please try again later.');
            }
        });
}


// Initialize or update user activity counters
// Initialize or update user activity counters
function updateUserCounter(activityType) {
    const countersString = localStorage.getItem('userCounters');
    let counters = countersString ? JSON.parse(countersString) : {};

    // Update the corresponding counter based on the activity type
    switch (activityType) {
        case 'login':
            counters.loginCounter = (counters.loginCounter || 0) + 1;
            break;
        case 'GET':
            counters.getCounter = (counters.getCounter || 0) + 1;
            break;
        case 'DELETE':
            counters.deleteCounter = (counters.deleteCounter || 0) + 1;
            break;
        case 'POST':
            counters.postCounter = (counters.postCounter || 0) + 1;
            break;
        case 'UPDATE':
            counters.updateCounter = (counters.updateCounter || 0) + 1;
            break;
        default:
            break;
    }

    // Save the updated counters back to localStorage
    localStorage.setItem('userCounters', JSON.stringify(counters));

    // Check for the conditions to redirect to the login page
    const numOfActions = parseInt(localStorage.getItem('numOfActions') || 0, 10);
    const sumOfActions = Object.values(counters).reduce((sum, count) => sum + count, 0);

    if (sumOfActions >= numOfActions) {
        redirectToLoginPage();
    }

    // Check for the condition to redirect to the login page after 24 hours
    const lastLoginTime = parseInt(localStorage.getItem('lastLoginTime') || 0, 10);
    const currentTime = new Date().getTime();
    const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

    if (currentTime - lastLoginTime >= twentyFourHoursInMillis) {
        // Reset counters and update last login time
        localStorage.setItem('userCounters', JSON.stringify({}));
        localStorage.setItem('lastLoginTime', currentTime);
    }
}
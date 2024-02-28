document.addEventListener('DOMContentLoaded', function () {
   
    // handle local storage
    let fullnamedisplay = localStorage.getItem('fullname');
    console.log(fullnamedisplay)
    const welcomeHeader = document.getElementById('welcomeHeader');
    if (welcomeHeader) {
        welcomeHeader.textContent = fullnamedisplay
            ? ` ${fullnamedisplay}*   `
            : 'Welcome to the Home Page'; // Set a default value if fullnamedisplay is null or undefined
    }

    const logoutBtn = document.getElementById('logoutBtn')

    logoutBtn.addEventListener('click', redirectToLoginPage);

});

function redirectToLoginPage() {

    window.location.href = 'loginpage.html';
}
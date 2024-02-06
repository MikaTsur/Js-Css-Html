function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updateDepartment(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get values from the form inputs
    var newDeptName = document.getElementById("newDeptName").value;
    var newManagerID = document.getElementById("newManagerID").value;

    // Get departmentId from the URL
    var departmentId = getParameterByName("departmentId");

    // Update the content of the first row
    document.getElementById("displayDeptName").innerHTML = "<b>" + newDeptName + "</b>";
    document.getElementById("displayManagerID").innerHTML = "<b>" + newManagerID + "</b>";

    // AJAX request to update the backend
    var url = "https://localhost:7201/api/Departments/" + departmentId;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: departmentId,
            departmentName: newDeptName,
            managerId: parseInt(newManagerID)
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle success if needed
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error if needed
    });
}

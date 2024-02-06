document.addEventListener("DOMContentLoaded", function () {
    // Get the departmentId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('departmentId');

    getSingleDepartment(departmentId);
});

async function getSingleDepartment(departmentId) {
    try {
        // Construct the URL with the dynamic departmentId
        let resp = await fetch(`https://localhost:7201/api/Departments/${departmentId}`);
        if (!resp.ok) {
            throw new Error(`Error fetching Employees: ${resp.status} ${resp.statusText}`);
        }

        let data = await resp.json();
        displaySingleDepartment(data);
    } catch (error) {
        console.error(`Error fetching singleDepartment: ${error.message}`);
    }
}


function displaySingleDepartment(singleDepartment) {
    console.log("Received employees data:", singleDepartment);


}

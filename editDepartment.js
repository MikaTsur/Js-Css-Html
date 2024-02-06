document.addEventListener("DOMContentLoaded", function () {
    getSingleDepartment();
});

async function getSingleDepartment() {
    try {
        let resp = await fetch("https://localhost:7201/api/Departments/${departmentId}");
        if (!resp.ok) {
            throw new Error(`Error fetching Employees: ${resp.status} ${resp.statusText}`);
        }

        let data = await resp.json();
        displaySingleDepartment(data);  // Corrected function name
    } catch (error) {
        console.error(`Error fetching singleDepartment: ${error.message}`);
    }
}

function displaySingleDepartment(singleDepartment) {
    console.log("Received employees data:", singleDepartment);


}

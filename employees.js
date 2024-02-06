document.addEventListener("DOMContentLoaded", function () {
    getEmployees();
});

async function getEmployees() {
    try {
        let resp = await fetch("https://localhost:7201/api/Employees");
        if (!resp.ok) {
            throw new Error(`Error fetching Employees: ${resp.status} ${resp.statusText}`);
        }

        let data = await resp.json();
        displayEmployees(data);  // Corrected function name
    } catch (error) {
        console.error(`Error fetching Employees: ${error.message}`);
    }
}

function displayEmployees(employees) {
    console.log("Received employees data:", employees);


}

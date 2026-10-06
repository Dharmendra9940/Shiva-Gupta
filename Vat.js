// ==========================================
// ASSET MANAGEMENT SYSTEM
// ==========================================


// Get assets from Local Storage
let assets = JSON.parse(localStorage.getItem("assets")) || [];


// ==========================================
// SAMPLE DATA
// ==========================================

if (assets.length === 0) {

    assets = [
        {
            id: "AST-1001",
            name: "Dell Laptop",
            category: "Laptop",
            serial: "DL2026001",
            assignedTo: "Rahul Kumar",
            department: "IT",
            purchaseDate: "2026-01-15",
            value: 65000,
            status: "Assigned",
            description: "Dell business laptop"
        },

        {
            id: "AST-1002",
            name: "HP Monitor",
            category: "Monitor",
            serial: "HP2026002",
            assignedTo: "",
            department: "",
            purchaseDate: "2026-02-20",
            value: 18000,
            status: "Available",
            description: "24 inch HP monitor"
        },

        {
            id: "AST-1003",
            name: "HP Printer",
            category: "Printer",
            serial: "PR2026003",
            assignedTo: "Amit Singh",
            department: "Accounts",
            purchaseDate: "2026-03-10",
            value: 25000,
            status: "Assigned",
            description: "Laser printer"
        },

        {
            id: "AST-1004",
            name: "Office Chair",
            category: "Furniture",
            serial: "CH2026004",
            assignedTo: "",
            department: "",
            purchaseDate: "2026-04-05",
            value: 8500,
            status: "Available",
            description: "Ergonomic office chair"
        },

        {
            id: "AST-1005",
            name: "Samsung Mobile",
            category: "Mobile",
            serial: "SM2026005",
            assignedTo: "Neha Sharma",
            department: "HR",
            purchaseDate: "2026-05-12",
            value: 32000,
            status: "Maintenance",
            description: "Company mobile phone"
        }
    ];

    saveAssets();
}


// ==========================================
// SAVE ASSETS
// ==========================================

function saveAssets() {

    localStorage.setItem(
        "assets",
        JSON.stringify(assets)
    );

}


// ==========================================
// NAVIGATION
// ==========================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    const buttons =
        document.querySelectorAll(".nav-btn");


    sections.forEach(section => {

        section.classList.remove("active");

    });


    buttons.forEach(button => {

        button.classList.remove("active");

    });


    document
        .getElementById(sectionId)
        .classList.add("active");


    const title = {

        dashboard: "Dashboard",

        assets: "Asset Management",

        addAsset: "Add Asset"

    };


    document.getElementById("pageTitle").textContent =
        title[sectionId];


    if (sectionId === "assets") {

        renderAssets();

    }

    if (sectionId === "dashboard") {

        updateDashboard();

    }

}


// ==========================================
// GENERATE ASSET ID
// ==========================================

function generateAssetId() {

    let maxNumber = 1000;

    assets.forEach(asset => {

        const number =
            parseInt(
                asset.id.replace("AST-", "")
            );

        if (number > maxNumber) {

            maxNumber = number;

        }

    });

    return `AST-${maxNumber + 1}`;

}


// ==========================================
// ADD / EDIT ASSET
// ==========================================

document
    .getElementById("assetForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const editId =
            document.getElementById("editId").value;


        const assetData = {

            name:
                document.getElementById("assetName").value.trim(),

            category:
                document.getElementById("category").value,

            serial:
                document.getElementById("serialNumber").value.trim(),

            assignedTo:
                document.getElementById("assignedTo").value.trim(),

            department:
                document.getElementById("department").value.trim(),

            purchaseDate:
                document.getElementById("purchaseDate").value,

            value:
                Number(
                    document.getElementById("value").value
                ),

            status:
                document.getElementById("status").value,

            description:
                document.getElementById("description").value.trim()

        };


        // EDIT EXISTING ASSET

        if (editId) {

            const index =
                assets.findIndex(
                    asset => asset.id === editId
                );


            if (index !== -1) {

                assets[index] = {

                    ...assets[index],

                    ...assetData

                };

            }

            alert("Asset updated successfully!");

        }

        // ADD NEW ASSET

        else {

            const newAsset = {

                id: generateAssetId(),

                ...assetData

            };


            assets.push(newAsset);


            alert("Asset added successfully!");

        }


        saveAssets();

        resetForm();

        updateDashboard();

        showSection("assets");

    });


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    document
        .getElementById("assetForm")
        .reset();


    document
        .getElementById("editId")
        .value = "";


    document
        .getElementById("formTitle")
        .textContent = "Add New Asset";

}


// ==========================================
// RENDER ASSETS
// ==========================================

function renderAssets(filteredAssets = assets) {

    const table =
        document.getElementById("assetTable");


    table.innerHTML = "";


    if (filteredAssets.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="9" class="no-data">
                    No assets found
                </td>
            </tr>
        `;

        return;

    }


    filteredAssets.forEach(asset => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${asset.id}</strong>
            </td>

            <td>${asset.name}</td>

            <td>${asset.category}</td>

            <td>${asset.serial}</td>

            <td>
                ${asset.assignedTo || "Not Assigned"}
            </td>

            <td>
                ${formatDate(asset.purchaseDate)}
            </td>

            <td>
                ₹${asset.value.toLocaleString("en-IN")}
            </td>

            <td>
                <span class="status ${asset.status.toLowerCase()}">
                    ${asset.status}
                </span>
            </td>

            <td>

                <button
                    class="action-btn edit"
                    onclick="editAsset('${asset.id}')"
                    title="Modify"
                >
                    ✏️
                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteAsset('${asset.id}')"
                    title="Delete"
                >
                    🗑️
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// EDIT ASSET
// ==========================================

function editAsset(id) {

    const asset =
        assets.find(
            asset => asset.id === id
        );


    if (!asset) return;


    document.getElementById("editId").value =
        asset.id;

    document.getElementById("assetName").value =
        asset.name;

    document.getElementById("category").value =
        asset.category;

    document.getElementById("serialNumber").value =
        asset.serial;

    document.getElementById("assignedTo").value =
        asset.assignedTo;

    document.getElementById("department").value =
        asset.department;

    document.getElementById("purchaseDate").value =
        asset.purchaseDate;

    document.getElementById("value").value =
        asset.value;

    document.getElementById("status").value =
        asset.status;

    document.getElementById("description").value =
        asset.description;


    document.getElementById("formTitle").textContent =
        "Edit Asset";


    showSection("addAsset");

}


// ==========================================
// DELETE ASSET
// ==========================================

function deleteAsset(id) {

    const asset =
        assets.find(
            asset => asset.id === id
        );


    if (!asset) return;


    const confirmDelete =
        confirm(
            `Are you sure you want to delete ${asset.name}?`
        );


    if (!confirmDelete) return;


    assets =
        assets.filter(
            asset => asset.id !== id
        );


    saveAssets();

    renderAssets();

    updateDashboard();

}


// ==========================================
// SEARCH ASSETS
// ==========================================

function searchAssets() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const status =
        document
            .getElementById("statusFilter")
            .value;


    const filtered =
        assets.filter(asset => {

            const matchesSearch =

                asset.id
                    .toLowerCase()
                    .includes(search)

                ||

                asset.name
                    .toLowerCase()
                    .includes(search)

                ||

                asset.category
                    .toLowerCase()
                    .includes(search)

                ||

                asset.serial
                    .toLowerCase()
                    .includes(search)

                ||

                asset.assignedTo
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                status === "" ||
                asset.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderAssets(filtered);

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const total =
        assets.length;


    const available =
        assets.filter(
            asset =>
                asset.status === "Available"
        ).length;


    const assigned =
        assets.filter(
            asset =>
                asset.status === "Assigned"
        ).length;


    const maintenance =
        assets.filter(
            asset =>
                asset.status === "Maintenance"
        ).length;


    const totalValue =
        assets.reduce(
            (sum, asset) =>
                sum + Number(asset.value),
            0
        );


    document.getElementById("totalAssets")
        .textContent = total;


    document.getElementById("availableAssets")
        .textContent = available;


    document.getElementById("assignedAssets")
        .textContent = assigned;


    document.getElementById("maintenanceAssets")
        .textContent = maintenance;


    document.getElementById("totalValue")
        .textContent =
            "₹" +
            totalValue.toLocaleString("en-IN");


    renderRecentAssets();

}


// ==========================================
// RECENT ASSETS
// ==========================================

function renderRecentAssets() {

    const table =
        document.getElementById(
            "recentAssetsTable"
        );


    table.innerHTML = "";


    const recent =
        [...assets]
            .reverse()
            .slice(0, 5);


    recent.forEach(asset => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${asset.id}</td>

            <td>${asset.name}</td>

            <td>${asset.category}</td>

            <td>
                ${asset.assignedTo || "Not Assigned"}
            </td>

            <td>
                <span class="status ${asset.status.toLowerCase()}">
                    ${asset.status}
                </span>
            </td>

            <td>
                ₹${asset.value.toLocaleString("en-IN")}
            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    if (!date) return "-";


    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

updateDashboard();

renderAssets();
// const socket = io("http://127.0.0.1:5000");

// const tableBody = document.querySelector("#table tbody");
// const dropdown = document.getElementById("patientSelect");

// let patientMap = {};
// let selectedPatient = null;

// // 🔹 Debug connection
// socket.on("connect", () => {
//     console.log("✅ Connected to server:", socket.id);
// });

// // 🔹 Add patients to dropdown
// function addToDropdown(d) {
//     if (!patientMap[d.patient_id]) {
//         patientMap[d.patient_id] = d.patient_name;

//         const option = document.createElement("option");
//         option.value = d.patient_id;
//         option.text = d.patient_name;

//         dropdown.appendChild(option);
//     }
// }

// // 🔹 Table update (UNCHANGED LOGIC)
// function createOrUpdateRow(d) {
//     if (!d) return;

//     addToDropdown(d);

//     let row = document.getElementById("patient-" + d.patient_id);

//     if (!row) {
//         row = document.createElement("tr");
//         row.id = "patient-" + d.patient_id;

//         row.innerHTML = `
//             <td class="name"></td>
//             <td class="id"></td>
//             <td class="hr"></td>
//             <td class="bp"></td>
//             <td class="ox"></td>
//             <td class="temp"></td>
//             <td class="time"></td>
//             <td class="status"></td>
//         `;

//         tableBody.appendChild(row);
//     }

//     row.querySelector(".name").innerText = d.patient_name;
//     row.querySelector(".id").innerText = d.patient_id;
//     row.querySelector(".hr").innerText = d.heart_rate;
//     row.querySelector(".bp").innerText = d.blood_pressure;
//     row.querySelector(".ox").innerText = d.oxygen_level;
//     row.querySelector(".temp").innerText = d.temperature;
//     row.querySelector(".time").innerText = d.timestamp;
//     row.querySelector(".status").innerText = d.alert;

//     row.querySelector(".hr").className = "hr " + ((d.heart_rate > 100 || d.heart_rate < 60) ? "alert" : "");
//     row.querySelector(".ox").className = "ox " + (d.oxygen_level < 95 ? "alert" : "");
//     row.querySelector(".temp").className = "temp " + ((d.temperature > 37.5 || d.temperature < 36) ? "alert" : "");
//     row.querySelector(".status").className = "status " + (d.alert === "Need Attention" ? "alert" : "");
// }

// // 🔹 Load last 5 minutes data
// function loadCharts(patientId) {
//     fetch(`/api/history/${patientId}`)
//         .then(res => res.json())
//         .then(data => drawCharts(data));
// }

// // 🔹 Draw graphs
// function drawCharts(data) {

//     const time = data.timestamps.map(t => new Date(t));

//     const commonLayout = {
//         paper_bgcolor: "#0b0f19",   // full background
//         plot_bgcolor: "#111827",    // chart area
//         font: { color: "white" },
//         xaxis: {
//             gridcolor: "#333",
//             zerolinecolor: "#333"
//         },
//         yaxis: {
//             gridcolor: "#333",
//             zerolinecolor: "#333"
//         },
//         margin: { t: 40 }
//     };

//     Plotly.newPlot("hrChart", [{
//         x: time,
//         y: data.heart_rate,
//         mode: "lines+markers",
//         line: { width: 2 }
//     }], {
//         ...commonLayout,
//         title: "❤️ Heart Rate"
//     });

//     Plotly.newPlot("oxChart", [{
//         x: time,
//         y: data.oxygen,
//         mode: "lines+markers",
//         line: { width: 2 }
//     }], {
//         ...commonLayout,
//         title: "🫁 Oxygen Level"
//     });

//     Plotly.newPlot("tempChart", [{
//         x: time,
//         y: data.temperature,
//         mode: "lines+markers",
//         line: { width: 2 }
//     }], {
//         ...commonLayout,
//         title: "🌡 Temperature"
//     });
// }

// // 🔹 Dropdown selection
// dropdown.addEventListener("change", (e) => {
//     selectedPatient = e.target.value;
//     loadCharts(selectedPatient);
// });

// // 🔹 Live updates
// socket.on("new_data", (data) => {
//     console.log("📡 LIVE:", data);

//     createOrUpdateRow(data);

//     if (selectedPatient && data.patient_id == selectedPatient) {
//         loadCharts(selectedPatient);
//     }
// });

// // 🔹 Initial load
// fetch("/api/all")
//     .then(res => res.json())
//     .then(data => {
//         console.log("📦 Initial load:", data);

//         data.forEach(createOrUpdateRow);

//         // auto-select first patient
//         setTimeout(() => {
//             if (dropdown.options.length > 0) {
//                 dropdown.selectedIndex = 0;
//                 selectedPatient = dropdown.value;
//                 loadCharts(selectedPatient);
//             }
//         }, 300);
//     })
//     .catch(err => console.error("❌ Fetch error:", err));
// Auto-connect to the current Render/Local server
const socket = io();

const tableBody = document.querySelector("#table tbody");
const dropdown = document.getElementById("patientSelect");

console.log("Table Body:", tableBody);

let patientMap = {};
let selectedPatient = null;

// Socket connection
socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("❌ Socket Error:", err);
});

// Add patients to dropdown
function addToDropdown(d) {
    if (!patientMap[d.patient_id]) {
        patientMap[d.patient_id] = d.patient_name;

        const option = document.createElement("option");
        option.value = d.patient_id;
        option.text = d.patient_name;

        dropdown.appendChild(option);
    }
}

// Create or update table row
function createOrUpdateRow(d) {
    if (!d) return;

    addToDropdown(d);

    let row = document.getElementById("patient-" + d.patient_id);

    if (!row) {
        row = document.createElement("tr");
        row.id = "patient-" + d.patient_id;

        row.innerHTML = `
            <td class="name"></td>
            <td class="id"></td>
            <td class="hr"></td>
            <td class="bp"></td>
            <td class="ox"></td>
            <td class="temp"></td>
            <td class="time"></td>
            <td class="status"></td>
        `;

        tableBody.appendChild(row);
    }

    row.querySelector(".name").innerText = d.patient_name;
    row.querySelector(".id").innerText = d.patient_id;
    row.querySelector(".hr").innerText = d.heart_rate;
    row.querySelector(".bp").innerText = d.blood_pressure;
    row.querySelector(".ox").innerText = d.oxygen_level;
    row.querySelector(".temp").innerText = d.temperature;
    row.querySelector(".time").innerText = d.timestamp;
    row.querySelector(".status").innerText = d.alert;

    row.querySelector(".hr").className =
        "hr " + ((d.heart_rate > 100 || d.heart_rate < 60) ? "alert" : "");

    row.querySelector(".ox").className =
        "ox " + (d.oxygen_level < 95 ? "alert" : "");

    row.querySelector(".temp").className =
        "temp " + ((d.temperature > 37.5 || d.temperature < 36) ? "alert" : "");

    row.querySelector(".status").className =
        "status " + (d.alert === "Need Attention" ? "alert" : "");
}

// Load patient history
function loadCharts(patientId) {
    fetch(`/api/history/${patientId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("📈 History:", data);
            drawCharts(data);
        })
        .catch(err => console.error("❌ History Error:", err));
}

// Draw charts
function drawCharts(data) {
    const time = data.timestamps.map(t => new Date(t));

    const commonLayout = {
        paper_bgcolor: "#0b0f19",
        plot_bgcolor: "#111827",
        font: { color: "white" },
        xaxis: {
            gridcolor: "#333",
            zerolinecolor: "#333"
        },
        yaxis: {
            gridcolor: "#333",
            zerolinecolor: "#333"
        },
        margin: { t: 40 }
    };

    Plotly.newPlot("hrChart", [{
        x: time,
        y: data.heart_rate,
        mode: "lines+markers",
        line: { width: 2 }
    }], {
        ...commonLayout,
        title: "❤️ Heart Rate"
    });

    Plotly.newPlot("oxChart", [{
        x: time,
        y: data.oxygen,
        mode: "lines+markers",
        line: { width: 2 }
    }], {
        ...commonLayout,
        title: "🫁 Oxygen Level"
    });

    Plotly.newPlot("tempChart", [{
        x: time,
        y: data.temperature,
        mode: "lines+markers",
        line: { width: 2 }
    }], {
        ...commonLayout,
        title: "🌡 Temperature"
    });
}

// Dropdown selection
dropdown.addEventListener("change", (e) => {
    selectedPatient = e.target.value;
    loadCharts(selectedPatient);
});

// Live updates
socket.on("new_data", (data) => {
    console.log("📡 LIVE:", data);

    createOrUpdateRow(data);

    if (selectedPatient && data.patient_id == selectedPatient) {
        loadCharts(selectedPatient);
    }
});

// Initial load
fetch("/api/all")
    .then(res => {
        console.log("📥 API Status:", res.status);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
    })
    .then(data => {
        console.log("📦 Initial load:", data);

        data.forEach(createOrUpdateRow);

        setTimeout(() => {
            if (dropdown.options.length > 0) {
                dropdown.selectedIndex = 0;
                selectedPatient = dropdown.value;
                loadCharts(selectedPatient);
            }
        }, 300);
    })
    .catch(err => {
        console.error("❌ Fetch error:", err);
    });
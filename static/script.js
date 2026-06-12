// ------------------------------
// Socket.IO
// ------------------------------

let socket = null;

if (typeof io !== "undefined") {
    socket = io({
        transports: ["websocket", "polling"]
    });

    console.log("✅ Socket.IO loaded");
} else {
    console.error("❌ Socket.IO failed to load");
}

// ------------------------------
// DOM Elements
// ------------------------------

const tableBody = document.querySelector("#table tbody");
const dropdown = document.getElementById("patientSelect");

let patientMap = {};
let selectedPatient = null;

// ------------------------------
// Socket Events
// ------------------------------

if (socket) {

    socket.on("connect", () => {
        console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("⚠️ Disconnected");
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket Error:", err);
    });

    socket.on("new_data", (data) => {
        console.log("📡 LIVE:", data);

        createOrUpdateRow(data);

        if (
            selectedPatient &&
            String(data.patient_id) === String(selectedPatient)
        ) {
            loadCharts(selectedPatient);
        }
    });
}

// ------------------------------
// Dropdown
// ------------------------------

function addToDropdown(d) {

    if (!patientMap[d.patient_id]) {

        patientMap[d.patient_id] = d.patient_name;

        const option = document.createElement("option");
        option.value = d.patient_id;
        option.textContent = d.patient_name;

        dropdown.appendChild(option);
    }
}

// ------------------------------
// Table Update
// ------------------------------

function createOrUpdateRow(d) {

    if (!d) return;

    addToDropdown(d);

    let row = document.getElementById(`patient-${d.patient_id}`);

    if (!row) {

        row = document.createElement("tr");
        row.id = `patient-${d.patient_id}`;

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

    row.querySelector(".name").textContent = d.patient_name;
    row.querySelector(".id").textContent = d.patient_id;
    row.querySelector(".hr").textContent = d.heart_rate;
    row.querySelector(".bp").textContent = d.blood_pressure;
    row.querySelector(".ox").textContent = d.oxygen_level;
    row.querySelector(".temp").textContent = d.temperature;
    row.querySelector(".time").textContent = d.timestamp;
    row.querySelector(".status").textContent = d.alert;

    row.querySelector(".hr").className =
        "hr " + ((d.heart_rate > 100 || d.heart_rate < 60) ? "alert" : "");

    row.querySelector(".ox").className =
        "ox " + (d.oxygen_level < 95 ? "alert" : "");

    row.querySelector(".temp").className =
        "temp " + ((d.temperature > 37.5 || d.temperature < 36) ? "alert" : "");

    row.querySelector(".status").className =
        "status " + (d.alert === "Need Attention" ? "alert" : "");
}

// ------------------------------
// History API
// ------------------------------

function loadCharts(patientId) {

    fetch(`/api/history/${patientId}`)
        .then(response => {

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response.json();
        })
        .then(data => {

            console.log("📈 History:", data);

            drawCharts(data);
        })
        .catch(error => {
            console.error("❌ History Error:", error);
        });
}

// ------------------------------
// Charts
// ------------------------------

function drawCharts(data) {

    if (!data.timestamps || data.timestamps.length === 0) {
        return;
    }

    const time = data.timestamps.map(t => new Date(t));

    const commonLayout = {
        paper_bgcolor: "#0b0f19",
        plot_bgcolor: "#111827",
        font: { color: "white" },
        xaxis: {
            gridcolor: "#333"
        },
        yaxis: {
            gridcolor: "#333"
        },
        margin: {
            t: 50
        }
    };

    Plotly.newPlot(
        "hrChart",
        [{
            x: time,
            y: data.heart_rate,
            mode: "lines+markers"
        }],
        {
            ...commonLayout,
            title: "Heart Rate"
        }
    );

    Plotly.newPlot(
        "oxChart",
        [{
            x: time,
            y: data.oxygen,
            mode: "lines+markers"
        }],
        {
            ...commonLayout,
            title: "Oxygen Level"
        }
    );

    Plotly.newPlot(
        "tempChart",
        [{
            x: time,
            y: data.temperature,
            mode: "lines+markers"
        }],
        {
            ...commonLayout,
            title: "Temperature"
        }
    );
}

// ------------------------------
// Dropdown Change
// ------------------------------

dropdown.addEventListener("change", (e) => {

    selectedPatient = e.target.value;

    if (selectedPatient) {
        loadCharts(selectedPatient);
    }
});

// ------------------------------
// Initial Data Load
// ------------------------------

fetch("/api/all")
    .then(response => {

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    })
    .then(data => {

        console.log("📦 Initial Data:", data);

        data.forEach(createOrUpdateRow);

        if (dropdown.options.length > 1) {

            dropdown.selectedIndex = 1;

            selectedPatient = dropdown.value;

            loadCharts(selectedPatient);
        }
    })
    .catch(error => {
        console.error("❌ API Error:", error);
    });
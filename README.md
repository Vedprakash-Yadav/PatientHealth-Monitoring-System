# 🏥 Real-Time Patient Monitoring System

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-green)
![Plotly](https://img.shields.io/badge/Plotly-Visualization-orange)
![Render](https://img.shields.io/badge/Render-Deployed-purple)

## 📌 Overview

A full-stack real-time healthcare monitoring dashboard that simulates patient vital signs, stores data in PostgreSQL, and visualizes live updates using interactive charts.

The application continuously tracks patient health metrics such as heart rate, oxygen saturation, body temperature, and blood pressure. Abnormal readings are automatically flagged to assist healthcare providers in identifying patients who may require immediate attention.

This project demonstrates practical implementation of:

* Real-time web applications
* WebSocket communication
* Database-driven dashboards
* Data visualization
* Cloud deployment

---

## 🚀 Live Demo

**Application:** https://patienthealth-monitoring-system-3.onrender.com

**Repository:** https://github.com/Vedprakash-Yadav/PatientHealth-Monitoring-System

---

## ✨ Key Features

### Real-Time Monitoring

* Live patient vital updates using Flask-SocketIO
* Automatic dashboard refresh without page reloads
* Continuous patient data streaming

### Health Analytics

* Heart Rate Monitoring
* Oxygen Saturation Monitoring
* Body Temperature Tracking
* Blood Pressure Tracking

### Intelligent Alerts

Automatically identifies abnormal readings:

| Parameter    | Healthy Range |
| ------------ | ------------- |
| Heart Rate   | 60 – 100 bpm  |
| Oxygen Level | ≥ 95%         |
| Temperature  | 36°C – 37.5°C |
| Systolic BP  | 90 – 140 mmHg |

Patients outside these ranges are marked:

```text
Need Attention
```

### Historical Trend Analysis

* Interactive Plotly charts
* Last 5-minute trend visualization
* Patient-specific health history

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │ Patient Simulator   │
                    │ (Vital Generator)   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ PostgreSQL Database │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │ Flask REST APIs │         │ Flask-SocketIO  │
        └────────┬────────┘         └────────┬────────┘
                 │                           │
                 ▼                           ▼
         ┌────────────────────────────────────┐
         │ Frontend Dashboard                 │
         │ HTML + CSS + JavaScript + Plotly  │
         └────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

* Python
* Flask
* Flask-SocketIO
* Pandas
* Psycopg2

### Database

* PostgreSQL

### Frontend

* HTML5
* CSS3
* JavaScript
* Plotly.js

### Deployment

* Render

---

## 📂 Project Structure

```text
project/
│
├── app.py
├── requirements.txt
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── index.html
│
└── README.md
```

---

## 🔌 API Endpoints

### Latest Patient Records

```http
GET /api/all
```

Returns the latest vital record for each patient.

---

### Patient History

```http
GET /api/history/<patient_id>
```

Returns patient vital history from the last 5 minutes.

---

## 📊 Dashboard Preview

### Latest Vitals Table

Displays current patient health metrics and alert status.

### Interactive Trend Charts

* Heart Rate Trend
* Oxygen Level Trend
* Temperature Trend

## 📊 Dashboard Preview

### Dashboard

![Dashboard](screenshots/Dashboard.png)

### Patient Trend Charts

![Charts](screenshots/charts.png)

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Vedprakash-Yadav/PatientHealth-Monitoring-System
cd YOUR_REPOSITORY
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variable

Create:

```env
DATABASE_URL=your_postgresql_connection_string
```

### Run Application

```bash
python app.py
```

Visit:

```text
http://localhost:5000
```

---

## 💡 Technical Highlights

### Real-Time Communication

Implemented bidirectional communication using Flask-SocketIO to stream patient updates instantly to connected clients.

### Database Design

Designed a PostgreSQL-backed data model to store patient vital signs and support historical trend analysis.

### Dynamic Visualization

Integrated Plotly charts for interactive monitoring of health metrics over time.

### Alert Engine

Developed rule-based anomaly detection for abnormal vital signs.

### Cloud Deployment

Successfully deployed the application and database infrastructure on Render.

---

## 📈 Skills Demonstrated

* Full-Stack Web Development
* Real-Time Systems
* REST API Development
* PostgreSQL Database Design
* Data Visualization
* Cloud Deployment
* WebSocket Communication
* Python Backend Engineering

---

## 🔮 Future Enhancements

* User Authentication & Authorization
* Doctor and Nurse Dashboards
* Email/SMS Notifications
* Real IoT Device Integration
* Patient Report Generation
* Docker Containerization
* Kubernetes Deployment
* Machine Learning Based Risk Prediction

---

## 👨‍💻 Author

**Vedprakash Yadav**

GitHub: https://github.com/Vedprakash-Yadav

LinkedIn: https://www.linkedin.com/in/vedprakash-yadav-bb6a07282/

Email: vedprakash.y0510@gmail.com

---

### ⭐ If you found this project interesting, consider giving it a star!

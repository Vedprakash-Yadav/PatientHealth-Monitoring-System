from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import psycopg2
import pandas as pd
import os
import threading
import time
import random
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)


# ALERT LOGIC
def check_abnormal(v):
    if (
        v['heart_rate'] < 60 or
        v['heart_rate'] > 100 or
        v['oxygen_level'] < 95 or
        v['temperature'] < 36 or
        v['temperature'] > 37.5 or
        v['bp_sys'] < 90 or
        v['bp_sys'] > 140
    ):
        return "Need Attention"
    return "Normal"


# MAIN PAGE
@app.route("/")
def index():
    return render_template("index.html")


# INITIAL DATA
@app.route("/api/all")
def get_all():
    conn = get_db_connection()

    df = pd.read_sql(
        """
        SELECT DISTINCT ON (patient_id) *
        FROM patient_vitals
        ORDER BY patient_id, timestamp DESC
        """,
        conn
    )

    conn.close()

    data = []

    for _, r in df.iterrows():
        d = dict(r)

        d["blood_pressure"] = (
            f"{r['blood_pressure_systolic']}/"
            f"{r['blood_pressure_diastolic']}"
        )

        d["alert"] = check_abnormal({
            "heart_rate": r["heart_rate"],
            "oxygen_level": r["oxygen_level"],
            "temperature": r["temperature"],
            "bp_sys": r["blood_pressure_systolic"]
        })

        d["timestamp"] = str(r["timestamp"])
        data.append(d)

    return jsonify(data)


@app.route("/api/history/<int:patient_id>")
def get_history(patient_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT timestamp, heart_rate, oxygen_level, temperature
        FROM patient_vitals
        WHERE patient_id = %s
        AND timestamp >= NOW() - INTERVAL '5 minutes'
        ORDER BY timestamp ASC
        """,
        (patient_id,)
    )

    rows = cur.fetchall()
    conn.close()

    data = {
        "timestamps": [str(r[0]) for r in rows],
        "heart_rate": [r[1] for r in rows],
        "oxygen": [float(r[2]) for r in rows],
        "temperature": [float(r[3]) for r in rows],
    }

    return jsonify(data)


# REAL-TIME SIMULATOR
def simulator():
    patients = [
        (1, "Alice"),
        (2, "Bob"),
        (3, "Charlie"),
        (4, "David"),
        (5, "Eve"),
        (6, "Frank"),
        (7, "Grace"),
        (8, "Helen")
    ]

    while True:
        try:
            conn = get_db_connection()
            cur = conn.cursor()

            for pid, name in patients:
                hr = random.randint(50, 120)
                ox = round(random.uniform(88, 100), 2)
                temp = round(random.uniform(34, 42), 2)
                sys = random.randint(90, 170)
                dia = random.randint(60, 110)

                cur.execute(
                    """
                    INSERT INTO patient_vitals
                    (
                        patient_id,
                        patient_name,
                        heart_rate,
                        oxygen_level,
                        temperature,
                        blood_pressure_systolic,
                        blood_pressure_diastolic,
                        timestamp
                    )
                    VALUES (%s,%s,%s,%s,%s,%s,%s,NOW())
                    """,
                    (pid, name, hr, ox, temp, sys, dia)
                )

                data = {
                    "patient_id": pid,
                    "patient_name": name,
                    "heart_rate": hr,
                    "oxygen_level": ox,
                    "temperature": temp,
                    "blood_pressure": f"{sys}/{dia}",
                    "timestamp": datetime.now().strftime("%H:%M:%S"),
                    "alert": check_abnormal({
                        "heart_rate": hr,
                        "oxygen_level": ox,
                        "temperature": temp,
                        "bp_sys": sys
                    })
                }

                print("LIVE:", data)
                socketio.emit("new_data", data)

            conn.commit()
            cur.close()
            conn.close()

        except Exception as e:
            print("❌ Simulator error:", e)

        time.sleep(3)


# START
if __name__ == "__main__":
    socketio.start_background_task(simulator)
    socketio.run(app, debug=True)
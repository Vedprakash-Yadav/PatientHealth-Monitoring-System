import psycopg2
import os

DATABASE_URL = os.getenv("DATABASE_URL")
def create_table():
    print(DATABASE_URL)
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS patient_vitals (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER,
        patient_name VARCHAR(100),
        heart_rate INTEGER,
        oxygen_level DECIMAL(5,2),
        temperature DECIMAL(4,2),
        blood_pressure_systolic INTEGER,
        blood_pressure_diastolic INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

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

    for pid, name in patients:
        cur.execute("""
        INSERT INTO patient_vitals
        (patient_id, patient_name, heart_rate, oxygen_level, temperature,
         blood_pressure_systolic, blood_pressure_diastolic)
        VALUES (%s,%s,75,98,36.5,120,80)
        """, (pid, name))

    conn.commit()
    cur.close()
    conn.close()

    print("✅ Table ready")

if __name__ == "__main__":
    create_table()
    print("🚀 Setup complete")
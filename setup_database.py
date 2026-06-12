import psycopg2

DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'root',
    'host': 'localhost',
    'port': '5432'
}

def create_database():
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM pg_database WHERE datname = 'patient_monitoring'")
    if not cur.fetchone():
        cur.execute("CREATE DATABASE patient_monitoring")
        print("✅ Database created")
    else:
        print("✅ Database already exists")

    cur.close()
    conn.close()

def create_table():
    config = DB_CONFIG.copy()
    config['dbname'] = 'patient_monitoring'

    conn = psycopg2.connect(**config)
    cur = conn.cursor()

    cur.execute("DROP TABLE IF EXISTS patient_vitals")

    cur.execute("""
    CREATE TABLE patient_vitals (
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
    create_database()
    create_table()
    print("🚀 Setup complete")
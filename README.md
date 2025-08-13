# GreenCart Logistics – MSSQL Edition (Full Stack)

Node/Express + **MS SQL Server** backend and React (Vite) frontend. Seeds data from `drivers.csv`, `routes.csv`, `orders.csv`.

## Quickstart

```bash
# 1) Create DB objects in SQL Server (see schema below)
# 2) Backend
cd backend
npm i
cp ../.env.example ../.env   # then edit values
npm run dev

# Seed data (expects CSVs in backend/data)
node scripts/seedFromCsv.js

# 3) Frontend
cd ../frontend
npm i
npm run dev
```

## MSSQL Schema (run in SSMS/Azure Data Studio)
```sql
CREATE TABLE Drivers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    shift_hours INT NOT NULL,
    past_week_hours NVARCHAR(50) NOT NULL
);

CREATE TABLE Routes (
    id INT PRIMARY KEY,
    distance_km INT NOT NULL,
    traffic_level NVARCHAR(10) NOT NULL,
    base_time_min INT NOT NULL
);

CREATE TABLE Orders (
    id INT PRIMARY KEY,
    value_rs INT NOT NULL,
    route_id INT NOT NULL FOREIGN KEY REFERENCES Routes(id),
    delivery_time TIME NOT NULL
);

CREATE TABLE SimulationResults (
    id INT IDENTITY(1,1) PRIMARY KEY,
    drivers_available INT,
    route_start_time TIME,
    max_hours_per_driver INT,
    total_profit FLOAT,
    efficiency_score FLOAT,
    on_time INT,
    late INT,
    fuel_cost FLOAT,
    bonus_total FLOAT,
    penalty_total FLOAT,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) DEFAULT 'manager'
);
```

# Kolay Restaurant Management System (KRMS)

**Design and Development of Kolay Restaurant Management System: A Web and Mobile-Based Smart Restaurant Operations Platform**

## Background of the Study
Restaurants often face challenges in managing orders, inventory, staff coordination, and customer service efficiently. Manual systems lead to delays, errors in billing, stock mismanagement, and poor customer experience.

With the rise of digital transformation, restaurants require integrated systems that combine Point of Sale (POS), inventory management, kitchen coordination, and customer engagement into a single platform.

This project proposes the development of the Kolay Restaurant Management System (KRMS) to automate and streamline restaurant operations.

## Problem Statement
Many restaurants experience:
* Inefficient order processing and delays
* Poor inventory tracking leading to stock wastage
* Lack of real-time communication between waiters and kitchen staff
* Difficulty in tracking sales and profits
* Limited customer engagement and loyalty systems
* Manual billing errors

There is a need for a centralized digital system that improves efficiency, accuracy, and customer satisfaction.

## Objectives of the Project
### General Objective:
To design and develop a smart restaurant management system that automates restaurant operations.

### Specific Objectives:
* To develop a POS system for order and billing management
* To implement inventory tracking and stock control
* To design a kitchen order management system (KDS)
* To enable table and reservation management
* To integrate customer ordering and loyalty features
* To generate sales and financial reports
* To improve communication between restaurant departments

## Scope of the System
The system will cover:
* Admin, Manager, Cashier, Waiter, Chef, Storekeeper, Accountant, and Customer modules
* Web-based dashboard for restaurant management
* Mobile application for customers and staff (Flutter)
* Real-time order processing
* Inventory and sales tracking
* Reporting and analytics system

## System Users and Roles
* Admin/Owner – Full system control
* Manager – Daily operations supervision
* Cashier – Billing and payments
* Waiter – Order taking and service
* Chef/Kitchen Staff – Food preparation tracking
* Storekeeper – Inventory management
* Accountant – Financial reporting
* Customer – Ordering and reservations

## Methodology / Technologies Used
* **Backend**: Java (Spring Boot)
* **Frontend (Web)**: React.js / HTML, CSS, JavaScript
* **Mobile Application**: Flutter (Dart)
* **Database**: MySQL
* **APIs**: RESTful APIs (JSON)
* **Payment Integration**: M-Pesa API (Kenya), Stripe API (future expansion)

## System Features
* Point of Sale (POS) system
* Digital menu management
* Kitchen display system (KDS)
* Inventory and stock control
* Customer ordering via QR code
* Table reservation system
* Loyalty and rewards system
* Sales and financial reporting
* Multi-role access control
* Real-time order tracking

## Expected Outcomes
The system is expected to:
* Improve efficiency in restaurant operations
* Reduce human errors in billing and inventory
* Enhance customer experience
* Provide real-time business insights
* Increase profitability through better management

## Significance of the Study
The system will benefit:
* Restaurant owners by improving profitability and control
* Staff by simplifying operations and communication
* Customers by improving service speed and experience
* Researchers as a reference for restaurant automation systems

## System Architecture (Overview)
* Flutter Mobile App ↔ Spring Boot API ↔ MySQL Database
* React Web Dashboard ↔ Spring Boot API ↔ MySQL Database

## Conclusion
The Kolay Restaurant Management System aims to transform traditional restaurant operations into a smart, efficient, and automated digital platform. By integrating web and mobile technologies, the system will improve service delivery, reduce operational inefficiencies, and support business growth.

---

## Getting Started

### Default Admin Credentials
After first startup the system seeds a default admin account:
- **Username:** `admin`
- **Password:** `admin123`

### Local Development

**Backend (Spring Boot — no MySQL required):**
```bash
cd api
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
This uses an H2 in-memory database. The H2 console is available at `http://localhost:8080/h2-console`.

**Frontend (React):**
```bash
cd web
cp .env.example .env          # set VITE_API_URL=http://localhost:8080/api
npm install
npm run dev
```

### Production Deployment (Vercel + Docker)

The frontend is deployed on Vercel. The backend must be hosted separately (e.g. Railway, Render, Fly.io) and the `VITE_API_URL` environment variable **must** be set in Vercel's project settings to point to the live backend URL.

> ⚠️ **Login will fail with "Invalid username or password"** if `VITE_API_URL` is not set — the frontend will try to reach `http://localhost:8080/api` which does not exist in the browser.

**Steps:**
1. Deploy the backend (Docker image from `api/Dockerfile`) to a cloud provider
2. In Vercel → Project Settings → Environment Variables, add:
   ```
   VITE_API_URL = https://<your-backend-host>/api
   ```
3. Redeploy the Vercel project

For full-stack local Docker:
```bash
docker compose up --build
```

---

### Kolay Restaurant Theme Colors
* **Primary Color (Main Brand Color)**: Deep Brown / Coffee Brown (#4E2C1E or #5A3825)
* **Secondary Color (Appetite / Energy)**: Warm Orange / Amber (#E67E22 or #F28C28)
* **Accent Color (Luxury Touch)**: Golden Yellow (#D4A017)
* **Background Color**: Cream / Off-white (#FFF8F0 or #FAF3E0)
* **Text Color**: Dark Charcoal (#2C2C2C)

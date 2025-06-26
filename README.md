
---

```markdown
# 🏥 Hospital-X Backend API

**Hospital-X** is a complete, production-ready backend system for managing complex hospital operations. Built with **Node.js**, **Express**, and **MongoDB**, this API powers real-time workflows for appointments, lab reports, billing, user management, and more — all secured by a robust **Role-Based Access Control (RBAC)** system.

---

## 🌟 Highlights

- ✅ OTP-based Authentication (Email/Phone)
- ✅ Modular API Structure
- ✅ RBAC with Route-Level Permissions
- ✅ Cloudinary + Multer for Lab Report Uploads
- ✅ Auto Email Report Delivery (HTML format)
- ✅ MongoDB Aggregation for Billing & Stats
- ✅ Structured Logging with Winston
- ✅ Admin-Ready: Full control panel APIs and filters

---

## 🚀 Core Features

### 🔐 Authentication & Role System
- OTP-based registration/login
- Roles: Admin, Doctor, Nurse, LabTech, Pharmacist, Patient
- Protected routes using middleware-based RBAC

### 🧪 Lab Reports with Email Integration
- Uploads PDF/image using Multer
- Stores securely on Cloudinary
- Sends styled HTML report to patient’s email with:
  - Report name
  - Upload date
  - Cloudinary download/view link

### 📅 Appointments & Medical Records
- Schedule and manage appointments
- Doctors and nurses access/update EHRs
- Admin can track all patient activity

### 💊 Pharmacy Module
- Doctor issues prescriptions
- Pharmacist sees only relevant prescriptions
- Medicine inventory tracking and stock level updates

### 🛏 Beds & Ward Management
- Bed allocation (ICU, General, Private)
- Track available vs. assigned beds

### 💸 Billing System
- Auto-generate invoices using MongoDB aggregation
- Tracks service charges, test fees, consultation, etc.

### 🧱 Access Control (RBAC)
- Fine-grained route protection
- Each role has defined scope:
  - Admin: Global control
  - Doctor: Appointments, EHR
  - Nurse: Bed/Patient monitoring
  - LabTech: Report uploads
  - Pharmacist: Medicine handling
  - Patient: Book/view appointments, reports, bills

---

## 🗂️ Folder Structure

```

server/
│

├── Models/          # Mongoose schemas

├── Routers/         # API routes

├── Controllers/     # Logic and business rules

├── middleWare/      # RBAC, auth, error handling

├── utils/           # Mail sender, multer config, etc.

├── config/          # MongoDB, Cloudinary config

├── app.js           # Entry point

└── Logger.log       # Winston log file

````

---

## 📬 Report Email Sample

✅ Triggered after lab report upload:  
Patient receives an HTML email with:

- 📄 Report type
- 📅 Date of upload
- 🔗 Secure Cloudinary view/download link

---

## 📦 Route Map
 -------------------------------------------------------------
| Endpoint         | Description                              |
|------------------|------------------------------------------|
| `/auth`          | OTP login/register                       |
| `/user`          | Profile, session                         |
| `/appointment`   | Appointment booking & management         |
| `/records`       | EHR record creation/update               |
| `/staff`         | Staff onboarding, filters                |
| `/department`    | Department CRUD                          |
| `/inventory`     | Equipment/supply tracking                |
| `/medicine`      | Medicine stock CRUD                      |
| `/prescriptions` | Prescription handling                    |
| `/report`        | Report upload + email                    |
| `/bed`           | Bed assignment/tracking                  |
| `/bills`         | Bill generation                          |
 -------------------------------------------------------------


## 🔒 Role Access Summary
-------------------------------------------------------------
| Role         | Access                                      |
|------------  |---------------------------------------------|
| **Admin**      | Manage all modules                       |
| **Doctor**     | Appointments, Prescriptions, EHR         |
| **Nurse**      | Bed status, limited record access        |
| **LabTech**    | Upload lab reports                       |
| **Pharmacist** | Manage medicines and prescriptions       |
| **Patient**    | Book/view appointments, view reports     |
|**SuperAdmin**  | For Everything Allowed (Owner)           |
-------------------------------------------------------------

---

## 🧪 Local Development

```bash
git clone https://github.com/asharful70786/Hospital-X-Management-System
cd Hospital-X-Management-System
npm install
npm run dev
````

### 🛠️ `.env` Example

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/hospital-x
cookie-Secret=your_cookie_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 📈 What's Next (Frontend Phase 🚀)

All backend logic is ✅ **100% complete**. Now preparing for the next phase:

* [ ] 🧑‍💻 Frontend (React + Tailwind + Framer Motion)
* [ ] 📊 Admin Dashboard UI (Charts, analytics, reports)
* [ ] ✅ Frontend Role-Based Dashboards
* [ ] ✅ Patient Portal (appointments, reports)
* [ ] 🔍 Doctor/Nurse Dashboards
* [ ] 📱 PWA-ready UI (mobile optimized)
* [ ] 📦 Integrate API via Axios with token-based headers

---

## 🙌 Author

Built with ❤️ by [@asharful70786](https://github.com/asharful70786)

> “Backend built for hospitals. Frontend coming for the world.”

---





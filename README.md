# 🎓 ShikshaSetu – Backend  
### Node.js + Express + MongoDB

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📌 Overview

ShikshaSetu Backend is a **secure, role-based REST API** designed for an academic management platform that connects **students, parents, faculty, and administrators**.

It manages authentication, authorization, and **real-world academic workflows** such as timetables, leave approvals, exams, fees, and grades.

---

## 🛠 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – REST API framework
- **MongoDB (Mongoose)** – NoSQL database
- **JWT (JSON Web Tokens)** – Authentication & authorization
- **bcryptjs** – Secure password hashing

---

## ✨ Key Features

- 🔐 Role-based authentication & authorization  
- 🧾 Secure JWT-based login system  
- 🏫 Branch / Year / Section–specific data access  
- 🔁 Real-world academic workflows  
- 🧱 Clean, modular backend architecture  

---

## 🔐 Authentication Flow

- Users register with **role-specific information**
- Passwords are **securely hashed** using bcrypt
- JWT tokens are generated during login
- Protected routes validate **token + user role**

---

## 👥 Supported Roles

- 🎓 Student  
- 👨‍👩‍👧 Parent  
- 👨‍🏫 Teacher  
- 🔬 Lab Assistant  
- 🧑‍💼 HOD  
- 📝 Exam Head  
- 🛠 Admin  

Each role has **controlled access** based on responsibility.

---

## 🔁 Core Workflows

### 🧑‍🎓 User Registration
- Validates role-specific fields
- Hashes passwords securely
- Stores user data in the database

---

### 🔑 Login
- Verifies credentials
- Issues JWT token with expiry

---

### 📅 Timetable Management
- HODs can create or update timetables
- Timetables are generated **day-wise and slot-wise**
- Lunch breaks are handled explicitly
- Students view only their class timetable
- Teachers view only their assigned slots

---

### 📝 Leave Approval Workflow
- Students apply for leave
- Parents approve or reject requests
- HODs provide final approval or rejection
- Leave status updates at each stage

---

### 🧪 Exam Management
- Exams created for specific branches and years
- Students can view only relevant exams

---

### 💰 Fees Management
- Semester-wise fee tracking
- Approval status maintained
- Students can view their own fee details

---

### 📊 Grades Management
- Teachers update student grades
- Grades stored semester-wise
- Students can access only their own grades

---

## 🔒 Security Considerations

- 🔐 Password hashing using bcrypt
- 🪪 JWT-protected routes
- 🧭 Role-based access enforcement
- 👁 Controlled data visibility

---

## ▶️ Running the Backend

```bash
npm install
npm node server.js
# 🎯 QuizCraft – A Full-Stack Quiz Application

### 👨‍💻 Developed by: Manideep Yamsani  

---

## 🧩 Overview

**QuizCraft** is a full-stack web application designed to help users enhance their knowledge through interactive quizzes across various programming and technical topics.  
Built with **React (frontend)**, **Spring Boot (backend)**, and **PostgreSQL (database)**, the system ensures a smooth user experience with secure authentication, real-time quiz evaluation, and detailed result analysis.

This project demonstrates a complete **end-to-end software engineering workflow** — from backend API design and database modeling to modern frontend UI development using React and Tailwind CSS.

---

## 🚀 Features

### 👥 User Module
- Register, login, and reset password via email verification  
- Attempt quizzes by selecting topics, difficulty levels, and number of questions  
- View detailed quiz results with score, accuracy, and correct answers  
- History page showing all previous attempts  
- Change password functionality  
- Real-time feedback on answers after submission  

### 🛠️ Admin Module
- Separate admin dashboard and navigation bar  
- Add, update, or delete quiz topics  
- Create and manage questions linked to topics and difficulty levels  
- View all users, topics, and questions  
- Secure access using **JWT-based authentication**  
- Monitor quiz performance and user progress  

---

## 🏗️ System Architecture

QuizCraft follows a **three-tier architecture**:

Frontend (React + Tailwind) → REST API (Spring Boot) → PostgreSQL Database


The communication between frontend and backend happens via **RESTful JSON APIs**, while authentication and authorization are handled using **JWT tokens**.

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| Backend | Spring Boot 3, Spring Security 6, Lombok, JPA/Hibernate |
| Database | PostgreSQL |
| Build Tools | Maven |
| Authentication | JWT (JSON Web Tokens) |
| Email Service | Spring Mail (SMTP + Gmail Integration) |
| Testing | Jest (Frontend), JUnit (Backend) |
| Deployment | Render / Railway / Vercel (optional) |

---

## 🧠 Key Functional Modules

### Frontend Highlights
- Modern UI built with React + Tailwind  
- Responsive design for desktop and mobile  
- Protected routes using React Router v7  
- Context-based authentication system  
- Real-time progress bar in quiz play screen  

### Backend Highlights
- Layered architecture (`Controller → Service → Repository`)  
- Data persistence using **Spring Data JPA**  
- Entity relationships: User ↔ Quiz ↔ Question ↔ Topic  
- Validation using `jakarta.validation` annotations  
- Exception handling via global error handler  

---

## 🗄️ Database Design (PostgreSQL)

### Core Tables:
- **User** → stores user credentials, roles, verification tokens  
- **Topic** → contains quiz topics and descriptions  
- **Question** → linked to topics, holds difficulty and multiple options  
- **Option** → each question’s possible answers and correct flag  
- **QuizAttempt** → stores attempt details and scoring  
- **QuizResult** → computed after submission with analytics  


---

## 🔐 Security & Authentication

- Implemented **JWT authentication** for both User and Admin roles.  
- Admin APIs are protected with role-based access using Spring Security.  
- All sensitive endpoints require valid tokens.  
- Passwords are hashed using **BCryptPasswordEncoder**.  
- Email verification and reset tokens are time-bound and securely generated.  

---

## 🧪 Testing & Validation

### Unit Testing
- JUnit for backend service layer testing.  
- Jest for React components and API mocks.  

### Validation
- All incoming requests validated with `@Valid` annotations.  
- Form validations for password, email, and quiz submissions.  
- Error handling with descriptive feedback on UI using **Sonner Toasts**.  

---

## ⚙️ Deployment & Setup

### 🖥️ Backend Setup
```bash
cd quiz-backend
mvn clean install
mvn spring-boot:run
```
Backend runs on → http://localhost:8080

Make sure the backend is running before launching the frontend.

### Environment Configuration
Frontend 
- .env
```bash
VITE_BASE_URL=http://localhost:8080
```

### Backend 
- application.properties
```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/quizdatabase
spring.datasource.username=postgres
spring.datasource.password=your_password
app.base.url=http://localhost:5173
jwt.secret=your-secret-key
```

### Challenges Faced
- Fixing infinite JSON recursion between entities (solved via @JsonManagedReference and @JsonBackReference)
- Debugging CORS issues between React and Spring Boot
- Handling duplicate email verification tokens and expired reset links
- Optimizing quiz result calculation to avoid extra DB calls
- Managing state across multiple React components

### Future Enhancements
- Add AI-based question generation
- Enable quiz sharing via links
- Add leaderboard and achievement badges
- Enable Google OAuth login
- Build mobile version using React Native

### Conclusion
- QuizCraft is a comprehensive demonstration of a modern, scalable full-stack web application integrating frontend, backend, and database seamlessly.
- It encapsulates core software engineering concepts such as modular architecture, layered development, RESTful APIs, secure authentication, and responsive design — serving as an ideal foundation for advanced enterprise-level applications.

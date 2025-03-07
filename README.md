# Job Search App (Full-Stack)

A full-stack job search application built with **Node.js**, **Express.js**, **MongoDB**, and a **frontend** integrated using **CORS**. This project provides RESTful APIs for job seekers, companies, and admins to manage job postings, applications, and user interactions. The frontend is integrated with the backend using CORS, allowing seamless communication between the two.

---

## Features

### Authentication
- **User Registration**: Users can sign up with their details (firstName, lastName, email, password, etc.).
- **User Login**: Users can log in using their email and password. A JWT token is returned for authenticated requests.
- **Password Hashing**: User passwords are securely hashed using **bcrypt** before storing in the database.
- **JWT Authentication**: JSON Web Tokens (JWT) are used for secure authentication and authorization.
- **Role-Based Access Control**: Different roles (user, hr, admin) have access to specific endpoints and features.

### User Management
- **Update User Profile**: Users can update their profile information (e.g., firstName, lastName, profilePic).
- **Change Password**: Users can change their password after providing their current password.
- **Ban/Unban Users**: Admins can ban or unban users, restricting their access to certain features.
- **Delete User Account**: Users can delete their accounts, which also removes all related data (e.g., applications, jobs).

### For Job Seekers
- **Search Jobs**: Filter jobs by title, location, seniority level, and technical skills.
- **Apply to Jobs**: Submit applications with a CV.
- **Track Applications**: View the status of submitted applications (pending, accepted, rejected).

### For Companies
- **Post Jobs**: Create job opportunities with details like title, location, and description.
- **Manage Applications**: View and update the status of job applications.
- **Ban/Unban Users**: Restrict users from applying to jobs.
- **Approve Jobs**: Mark jobs as approved by the admin.

### Admin Features
- **Approve Companies**: Approve or reject company registrations.
- **Ban/Unban Companies**: Restrict companies from posting jobs.

---

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Joi**: Schema validation for API requests.
- **Bcrypt**: Password hashing for user authentication.
- **JSON Web Token (JWT)**: Authentication and authorization.
- **ExcelJS**: Generate Excel sheets for application data.

### Frontend Integration
- **CORS**: Enables cross-origin requests from the frontend to the backend.
- **Fetch API**: Used in the frontend to make HTTP requests to the backend.

### Tools
- **Postman**: API testing.
- **Git**: Version control.
- **GitHub**: Hosting the repository.

---

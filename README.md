# Video Annotation Platform

## Project Overview
A full-stack web application that allows users to upload videos, create annotations and bookmarks at specific timestamps. The platform includes role-based access control with separate views for regular users and administrators.

## Technologies Used

### Backend
- ASP.NET Core 9 - REST API development
- Entity Framework Core - ORM for database operations
- SQL Server / LocalDB - Database
- JWT Authentication - Secure user authentication
- BCrypt - Password hashing
- CORS - Cross-origin resource sharing

### Frontend
- React 18 - UI library
- Vite - Build tool and development server
- Tailwind CSS - Styling and responsive design
- React Router DOM - Client-side routing
- Axios - HTTP client for API requests
- Framer Motion - Animations
- React Hot Toast - Toast notifications
- Heroicons - Icons

## Features

### User Features
- User registration and login
- JWT authentication with refresh tokens
- Video upload (max 100MB)
- Video playback with custom player
- Create annotations at specific timestamps
- Create bookmarks with titles
- View annotations while watching videos
- Delete own annotations and bookmarks
- Dashboard with video statistics

### Admin Features
- Admin dashboard with overview statistics
- View all users and videos
- Delete any video
- Delete non-admin users
- Real-time data updates
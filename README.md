<<<<<<< HEAD
# new-Idea-mine-
inspired by 99x go vibe codeing
=======
# Travel Tracker Application

A full-stack web application for tracking travel history, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (register, login, logout)
- Trip management (create, view, edit, delete)
- Photo upload support
- Search and filter trips by category, date range, or keywords
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travel-tracker
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Project Structure

```
travel-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Trip.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── trips.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   └── App.js
    └── package.json
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Trips
- GET /api/trips - Get all trips for the logged-in user
- POST /api/trips - Create a new trip
- GET /api/trips/:id - Get a specific trip
- PUT /api/trips/:id - Update a trip
- DELETE /api/trips/:id - Delete a trip

## Environment Variables

### Backend (.env)
- PORT - Server port (default: 5000)
- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret key for JWT token generation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Verify Installation

To verify that Node.js and npm are installed correctly, you can check their versions with the following commands:

```bash
node --version
npm --version
```
>>>>>>> 3db0fc43 (Initial commit: Added full frontend and backend files for tourist tracker)

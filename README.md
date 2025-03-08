# Opinions

A feature-rich polling platform built using **React** and **Node.js (Express)**, allowing users to create, vote, and manage polls with various types and filtering options.

## Features

- **User Authentication**: Secure login and signup with JWT authentication.
- **Create Polls**: Users can create different types of polls:
  - Single-choice
  - Yes/No
  - Rating-based
  - Open-ended
  - Image-based
- **View All Polls**: Browse all available polls in the system.
- **Filter Polls**: Users can filter polls based on type.
- **Vote on Polls**: Participate in polls and view results.
- **Bookmark Polls**: Save polls for quick access later.
- **Close Polls**: Admins can close polls once they are finished.
- **View Voted Polls**: Users can check their previous votes and results.
- **Delete Polls**: Admins have the right to remove polls.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Local & Hosted on MongoDB Atlas)
- **Authentication**: JWT (JSON Web Token)
- **Image Uploads**: Cloudinary

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Clone the Repository
```sh
git clone https://github.com/mitesh-kumavat/opinions.git
cd opinions
```

### Environment Variables
Create a `.env` file in the backend directory and configure the following:
```env
PORT= # Backend server port
MONGODB_URI= # Local MongoDB URL
CLIENT_URI= # Frontend URL
MONGO_LIVE_URI= # MongoDB Atlas URI

# Cloudinary Configuration for Image Uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# JWT Seceret key
JWT_SECRET=
```

### Install Dependencies
```sh
npm i
cd backend && npm i #Install backend  dependencies
cd frontend && npm i  # Install frontend dependencies
cd ..
```

### Running the Application
To start both frontend and backend simultaneously, run:
```sh
npm run both
```

---
**Made with ❤️ by Mitesh**